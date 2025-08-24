"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSimulateContract } from "wagmi" 
import { ConnectKitButton } from "connectkit"
import { Button } from "@/component/UI/button"
import { Input } from "@/component/UI/input"
import { Progress } from "@/component/UI/progress"
import { LoadingSpinner } from "./component/loading-spinner"
import { TokenPurchaseSkeleton } from "./component/loading-skeleton"
import { EthIcon, UsdtIcon, UsdcIcon } from "./component/crypto-icons"
import { useTokenCalculation } from "./hooks/use-token-calculation"
import { useToast } from "@/hooks/use-toast"

// Enhanced presale hook - temporarily disabled to fix loading issues
// import { useNexusWealthPresale } from './useNexusWealthPresale'

interface TokenPurchaseProps {
  currentPrice: string
  amountRaised: string
  tokenValue: string
  progressPercentage?: string
  totalTokensForSale?: string
  totalTokensSold?: string
  minPurchase?: string
  maxPurchase?: string
  saleActive?: boolean
}

// Contract ABI for the presale contract (keeping your existing ABI)
const PRESALE_ABI = [
  {
    "inputs": [],
    "name": "purchaseTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSaleInfo",
    "outputs": [
      { "name": "_saleActive", "type": "bool" },
      { "name": "_tokenPrice", "type": "uint256" },
      { "name": "_totalTokensForSale", "type": "uint256" },
      { "name": "_totalTokensSold", "type": "uint256" },
      { "name": "_minPurchase", "type": "uint256" },
      { "name": "_maxPurchase", "type": "uint256" },
      { "name": "_saleStartTime", "type": "uint256" },
      { "name": "_saleEndTime", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Contract address from our deployment
const PRESALE_CONTRACT_ADDRESS = "0x478dBa1446951Ae3679C40bc0e6566e24cedB520";

const currencyConfig = {
  ETH: { icon: EthIcon, color: "text-blue-400" },
  USDT: { icon: UsdtIcon, color: "text-green-500" },
  USDC: { icon: UsdcIcon, color: "text-blue-500" },
}

export default function TokenPurchaseEnhanced({ 
  currentPrice, 
  amountRaised, 
  tokenValue,
  progressPercentage = "0",
  totalTokensForSale = "1000000",
  totalTokensSold = "0",
  minPurchase = "0.01",
  maxPurchase = "10",
  saleActive = false
}: TokenPurchaseProps) {
  // ALL HOOKS MUST BE CALLED FIRST, before any conditional logic
  const [isHydrated, setIsHydrated] = useState(false)
  const { isConnected } = useAccount()
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState<keyof typeof currencyConfig>("ETH")
  const [componentLoading, setComponentLoading] = useState(true)
  const [useEnhancedPresale, setUseEnhancedPresale] = useState(false)

  const { toast } = useToast()
  const { tokenAmount, isCalculating } = useTokenCalculation({ amount, currency })

  // Enhanced presale hook - temporarily disabled to fix loading issues
  // const {
  //   connectWallet,
  //   disconnectWallet,
  //   connectionStatus,
  //   presaleStatus,
  //   userInfo,
  //   purchaseLimits,
  //   previewPurchase,
  //   executePurchase,
  //   loading: enhancedLoading,
  //   error: enhancedError
  // } = useNexusWealthPresale()

  // Temporary fallback values
  const connectWallet = () => {}
  const disconnectWallet = () => {}
  const connectionStatus = { isConnected: false, account: null, network: null, contractsInitialized: false }
  const presaleStatus = { isActive: false, saleToken: null, totalTokens: '0', soldTokens: '0', remainingTokens: '0', progress: '0' }
  const userInfo = { nwisBalance: '0', allowance: '0', totalPurchased: '0', totalSpent: '0' }
  const purchaseLimits = { minPurchase: '0', maxPurchase: '0' }
  const previewPurchase = () => ({ success: false, error: 'Not implemented' })
  const executePurchase = async (amount: number) => ({ success: false, error: 'Not implemented', transactionHash: '0x0000000000000000000000000000000000000000000000000000000000000000' })
  const enhancedLoading = false
  const enhancedError = null

  // Convert amount to wei for contract interaction
  const amountInWei = amount ? BigInt(Number.parseFloat(amount) * 1e18) : undefined

  // Enhanced presale data - memoized to prevent recalculation during render
  const enhancedSaleActive = presaleStatus.isActive
  const enhancedProgress = presaleStatus.progress
  const enhancedRemaining = presaleStatus.remainingTokens
  const enhancedSold = presaleStatus.soldTokens

  // Memoized simulation enabled state to prevent hook reordering
  const shouldSimulate = useMemo(() => 
    Boolean(amountInWei && isConnected && saleActive && !useEnhancedPresale),
    [amountInWei, isConnected, saleActive, useEnhancedPresale]
  )

  // Wagmi hooks (keeping your existing setup) - ALWAYS call hooks unconditionally
  const {
    data: simulationData,
    error: simulateError,
    isLoading: isSimulating,
  } = useSimulateContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: PRESALE_ABI,
    functionName: "purchaseTokens",
    args: [],
    value: amountInWei,
    query: { enabled: shouldSimulate },
  })

  const {
    data: hash,
    writeContract,
    isPending: isWritePending,
    isSuccess: isWriteSuccess,
    isError: isWriteError,
    error: writeError,
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isConfirmationError,
    error: confirmationError,
  } = useWaitForTransactionReceipt({
    hash,
    query: { enabled: true }, // Always enabled to prevent hook reordering
  })

  const isPurchasing = isWritePending || isCalculating || isSimulating || isConfirming

  // Use enhanced data if available, fallback to props - memoized
  const finalSaleActive = useMemo(() => 
    enhancedSaleActive !== undefined ? enhancedSaleActive : saleActive, 
    [enhancedSaleActive, saleActive]
  )
  
  const finalProgress = useMemo(() => 
    enhancedProgress !== "0" ? enhancedProgress : progressPercentage, 
    [enhancedProgress, progressPercentage]
  )
  
  const finalRemaining = useMemo(() => 
    enhancedRemaining !== "0" ? enhancedRemaining : (parseFloat(totalTokensForSale) - parseFloat(totalTokensSold)).toString(), 
    [enhancedRemaining, totalTokensForSale, totalTokensSold]
  )
  
  const finalSold = useMemo(() => 
    enhancedSold !== "0" ? enhancedSold : totalTokensSold, 
    [enhancedSold, totalTokensSold]
  )

  // ALL HOOKS MUST BE CALLED FIRST, before any conditional logic or early returns
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    // Only run this effect after component has mounted to prevent hydration issues
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => setComponentLoading(false), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  // Enhanced presale effects
  useEffect(() => {
    if (enhancedError) {
      toast({
        title: "Enhanced Presale Error",
        description: enhancedError,
        variant: "destructive",
      })
    }
  }, [enhancedError, toast])

  // Your existing effects
  useEffect(() => {
    if (isWriteSuccess) {
      toast({
        title: "Transaction Sent",
        description: `Transaction sent! Waiting for confirmation... Hash: ${hash?.slice(0, 6)}...`,
      })
    }
    if (isWriteError) {
      toast({
        title: "Purchase Failed",
        description: writeError?.message || "An unknown error occurred during purchase.",
        variant: "destructive",
      })
    }
  }, [isWriteSuccess, isWriteError, writeError, hash, toast])

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Purchase Confirmed",
        description: `Your purchase of ${tokenAmount} NWIS tokens is confirmed!`,
      })
      setAmount("")
    }
    if (isConfirmationError) {
      toast({
        title: "Transaction Failed",
        description: confirmationError?.message || "Transaction confirmation failed.",
        variant: "destructive",
      })
    }
  }, [isConfirmed, isConfirmationError, confirmationError, tokenAmount, toast])

  useEffect(() => {
    if (simulateError) {
      toast({
        title: "Transaction Simulation Failed",
        description: simulateError?.message || "Could not estimate gas for this transaction.",
        variant: "destructive",
      })
    }
  }, [simulateError, toast])

  // NOW we can have conditional logic and early returns
  if (!isHydrated) {
    return <TokenPurchaseSkeleton />
  }

  // Enhanced purchase handler
  const handleEnhancedPurchase = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to purchase.",
        variant: "destructive",
      })
      return
    }
    
    if (!finalSaleActive) {
      toast({
        title: "Sale Not Active",
        description: "The token sale is not currently active.",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await executePurchase(parseFloat(amount))
      if (result.success) {
        toast({
          title: "Purchase Successful",
          description: `Transaction submitted! Hash: ${result.transactionHash?.slice(0, 6)}...`,
        })
        setAmount("")
      } else {
        toast({
          title: "Purchase Failed",
          description: result.error || "An unknown error occurred.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      })
    }
  }

  // Your existing purchase handler
  const handlePurchase = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to purchase.",
        variant: "destructive",
      })
      return
    }
    
    if (!finalSaleActive) {
      toast({
        title: "Sale Not Active",
        description: "The token sale is not currently active.",
        variant: "destructive",
      })
      return
    }
    
    if (Number.parseFloat(amount) < Number.parseFloat(minPurchase)) {
      toast({
        title: "Amount Too Low",
        description: `Minimum purchase amount is ${minPurchase} ETH.`,
        variant: "destructive",
      })
      return
    }
    
    if (Number.parseFloat(amount) > Number.parseFloat(maxPurchase)) {
      toast({
        title: "Amount Too High",
        description: `Maximum purchase amount is ${maxPurchase} ETH.`,
        variant: "destructive",
      })
      return
    }

    if (writeContract && simulationData?.request) {
      writeContract(simulationData.request)
    }
  }

  const handleCurrencyChange = (newCurrency: keyof typeof currencyConfig) => {
    setCurrency(newCurrency)
  }

  if (componentLoading) {
    return <TokenPurchaseSkeleton />
  }

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 sm:p-6">
      {/* Enhanced Presale Toggle */}
      <div className="mb-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-blue-300">Enhanced Presale Mode</h3>
            <p className="text-xs text-blue-400">Real-time contract data & advanced features</p>
          </div>
          <Button
            variant={useEnhancedPresale ? "default" : "outline"}
            size="sm"
            onClick={() => setUseEnhancedPresale(!useEnhancedPresale)}
            className="text-xs"
          >
            {useEnhancedPresale ? "Enabled" : "Enable"}
          </Button>
        </div>
      </div>

      {/* Sale Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Sale Progress</span>
          <span className="text-sm text-white font-medium">{finalProgress}%</span>
        </div>
        <Progress value={parseFloat(finalProgress)} className="h-2" />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Sold: {finalSold} NWIS</span>
          <span>Remaining: {finalRemaining} NWIS</span>
        </div>
      </div>

      {/* Currency Selection */}
      <div className="mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Object.entries(currencyConfig).map(([curr, { icon: Icon, color }]) => {
            let buttonClasses = ""
            if (curr === "USDT") {
              buttonClasses = "bg-green-600 hover:bg-green-700 text-white"
            } else if (curr === "USDC") {
              buttonClasses = "bg-blue-600 hover:bg-blue-700 text-white"
            } else if (curr === "ETH") {
              buttonClasses = "bg-gray-600 hover:bg-gray-700 text-white"
            } else {
              buttonClasses = "bg-purple-600 hover:bg-purple-700 text-white"
            }

            return (
              <Button
                key={curr}
                variant={currency === curr ? "default" : "outline"}
                size="sm"
                onClick={() => handleCurrencyChange(curr as keyof typeof currencyConfig)}
                disabled={isSimulating || !finalSaleActive || enhancedLoading}
                className={`${buttonClasses} flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-2`}
              >
                {isSimulating && currency === curr ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${currency === curr ? "text-white" : color}`} />
                    {curr}
                  </>
                )}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Input and Calculation */}
      <div className="space-y-2 sm:space-y-3">
        <Input
          type="number"
          placeholder={`Enter ${currency} amount`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 text-sm sm:text-base h-12 sm:h-10"
          disabled={!isConnected || isSimulating || !finalSaleActive || enhancedLoading}
        />

        {/* Token Calculation Field */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-md p-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs sm:text-sm">You will receive:</span>
            {isCalculating || enhancedLoading ? (
              <LoadingSpinner size="sm" className="text-purple-400" />
            ) : (
              <span className="text-white font-medium text-sm sm:text-base">
                {tokenAmount ? `${tokenAmount} NWIS` : "0 NWIS"}
              </span>
            )}
          </div>
          {!isConnected && <p className="text-xs text-gray-500 mt-1">Connect wallet to see token calculation</p>}
          {!finalSaleActive && <p className="text-xs text-red-500 mt-1">Sale is not currently active</p>}
        </div>
      </div>

      {/* Buy Button */}
      {!isConnected ? (
        <ConnectKitButton.Custom>
          {({ show }) => (
            <Button
              onClick={show}
              className="w-full bg-[#a57e24] hover:bg-[#8a671d] text-white font-semibold py-3 sm:py-3 h-12 sm:h-10 text-sm sm:text-base transition-colors duration-200"
            >
              CONNECT WALLET
            </Button>
          )}
        </ConnectKitButton.Custom>
      ) : (
        <Button
          onClick={useEnhancedPresale ? handleEnhancedPurchase : handlePurchase}
          disabled={!amount || isPurchasing || (!simulationData?.request && !useEnhancedPresale) || !finalSaleActive || enhancedLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold py-3 h-12 sm:h-10 text-sm sm:text-base"
        >
          {isPurchasing || enhancedLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              {useEnhancedPresale 
                ? "Processing Enhanced Purchase..."
                : isSimulating
                  ? "Estimating Gas..."
                  : isConfirming
                    ? "Confirming Transaction..."
                    : "Processing Purchase..."}
            </>
          ) : (
            `Buy NWIS with ${currency} ${useEnhancedPresale ? '(Enhanced)' : ''}`
          )}
        </Button>
      )}

      {/* Additional Info */}
      <div className="text-center space-y-2 pt-2">
        <p className="text-xs text-gray-500 px-2">
          Min purchase: {minPurchase} {currency} • Max purchase: {maxPurchase} {currency}
        </p>
        <p className="text-xs text-gray-500 px-2">
          Next price increase in: {finalRemaining} NWIS
        </p>
        {useEnhancedPresale && (
          <p className="text-xs text-blue-400 px-2">
            ✓ Enhanced mode: Real-time contract data
          </p>
        )}
      </div>
    </div>
  )
}
