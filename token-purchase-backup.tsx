"use client"

import { useState, useEffect } from "react"
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

// Contract ABI for the presale contract
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
const PRESALE_CONTRACT_ADDRESS = "0xBcFc8FD134C113F3DBeb419A207d4D1cc477dC47";

const currencyConfig = {
  ETH: { icon: EthIcon, color: "text-blue-400" },
  USDT: { icon: UsdtIcon, color: "text-green-500" },
  USDC: { icon: UsdcIcon, color: "text-blue-500" },
}

export default function TokenPurchase({ 
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
  const { isConnected } = useAccount()
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState<keyof typeof currencyConfig>("ETH")
  const [componentLoading, setComponentLoading] = useState(true)
  const { toast } = useToast()

  const { tokenAmount, isCalculating } = useTokenCalculation({ amount, currency })

  // Convert amount to wei for contract interaction
  const amountInWei = amount ? BigInt(Number.parseFloat(amount) * 1e18) : undefined

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
    query: { enabled: Boolean(amountInWei && isConnected && saleActive) },
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
    query: { enabled: Boolean(hash) },
  })

  const isPurchasing = isWritePending || isCalculating || isSimulating || isConfirming

  useEffect(() => {
    const timer = setTimeout(() => setComponentLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

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

  const handlePurchase = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to purchase.",
        variant: "destructive",
      })
      return
    }
    
    if (!saleActive) {
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
    
    if (!simulationData?.request) {
      toast({
        title: "Transaction Error",
        description: "Could not prepare transaction. Please try again.",
        variant: "destructive",
      })
      return
    }
    writeContract(simulationData.request)
  }

  const handleCurrencyChange = async (newCurrency: keyof typeof currencyConfig) => {
    setCurrency(newCurrency)
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  if (componentLoading) return <TokenPurchaseSkeleton />

  return (
    <div className="space-y-6">
      <div className="bg-transparent p-0">
        <h3 className="text-sky-950 text-lg sm:text-xl md:text-2xl font-semibold text-center md:text-left">Token Sale</h3>
      </div>
      
      {/* Sale Status */}
      <div className="text-center">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          saleActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {saleActive ? '🟢 Sale Active' : '🔴 Sale Inactive'}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="text-gray-400">Raised</span>
          <span className="text-white">{progressPercentage}%</span>
        </div>
        <Progress value={parseFloat(progressPercentage)} className="h-2 bg-gray-800 [&>div]:bg-[#A57E24]" />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{amountRaised}</span>
          <span>${(parseFloat(totalTokensForSale) * parseFloat(currentPrice.replace('$', ''))).toLocaleString()}</span>
        </div>
      </div>

      {/* Current Price */}
      <div className="text-center">
        <p className="text-gray-400 text-xs sm:text-sm mb-1">Current Price</p>
        <p className="text-xl sm:text-2xl font-bold text-white">{currentPrice}</p>
        <p className="text-gray-500 text-xs">{tokenValue}</p>
      </div>

      {/* Purchase Form */}
      <div className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-3 gap-1 sm:gap-2">
          {(Object.keys(currencyConfig) as Array<keyof typeof currencyConfig>).map((curr) => {
            const { icon: Icon, color } = currencyConfig[curr]
            let buttonClasses = "bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700"
            if (currency === curr) {
              if (curr === "USDT") {
                buttonClasses = "bg-green-600 hover:bg-green-700 text-white"
              } else if (curr === "USDC") {
                buttonClasses = "bg-blue-600 hover:bg-blue-700 text-white"
              } else if (curr === "ETH") {
                buttonClasses = "bg-gray-600 hover:bg-gray-700 text-white"
              } else {
                buttonClasses = "bg-purple-600 hover:bg-purple-700 text-white"
              }
            }

            return (
              <Button
                key={curr}
                variant={currency === curr ? "default" : "outline"}
                size="sm"
                onClick={() => handleCurrencyChange(curr)}
                disabled={isSimulating || !saleActive}
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

        <div className="space-y-2 sm:space-y-3">
          <Input
            type="number"
            placeholder={`Enter ${currency} amount`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 text-sm sm:text-base h-12 sm:h-10"
            disabled={!isConnected || isSimulating || !saleActive}
          />

          {/* Token Calculation Field */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-md p-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs sm:text-sm">You will receive:</span>
              {isCalculating ? (
                <LoadingSpinner size="sm" className="text-purple-400" />
              ) : (
                <span className="text-white font-medium text-sm sm:text-base">{tokenAmount ? `${tokenAmount} NWIS` : "0 NWIS"}</span>
              )}
            </div>
            {!isConnected && <p className="text-xs text-gray-500 mt-1">Connect wallet to see token calculation</p>}
            {!saleActive && <p className="text-xs text-red-500 mt-1">Sale is not currently active</p>}
          </div>
        </div>

        {/* Buy Button with Wallet Connection Check */}
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
            onClick={handlePurchase}
            disabled={!amount || isPurchasing || !simulationData?.request || !saleActive}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold py-3 h-12 sm:h-10 text-sm sm:text-base"
          >
            {isPurchasing ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                {isSimulating
                  ? "Estimating Gas..."
                  : isConfirming
                    ? "Confirming Transaction..."
                    : "Processing Purchase..."}
              </>
            ) : (
              `Buy NWIS with ${currency}`
            )}
          </Button>
        )}
      </div>

      {/* Additional Info */}
      <div className="text-center space-y-2 pt-2">
        <p className="text-xs text-gray-500 px-2">
          Min purchase: {minPurchase} {currency} • Max purchase: {maxPurchase} {currency}
        </p>
        <p className="text-xs text-gray-500 px-2">Next price increase in: {parseFloat(totalTokensForSale) - parseFloat(totalTokensSold)} NWIS</p>
      </div>
    </div>
  )
}
