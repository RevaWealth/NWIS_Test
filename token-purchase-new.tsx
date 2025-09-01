"use client"

import { useState, useEffect, useMemo } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSimulateContract, useChainId } from "wagmi" 
import { ConnectKitButton, useModal } from "connectkit"
import { Button } from "@/component/UI/button"
import { Input } from "@/component/UI/input"
import { LoadingSpinner } from "./component/loading-spinner"
import { TokenPurchaseSkeleton } from "./component/loading-skeleton"
import { EthIcon, UsdtIcon, UsdcIcon } from "./component/crypto-icons"
import { useTokenCalculation } from "./hooks/use-token-calculation"
import { useEthPrice } from "./hooks/use-eth-price"
import { useToast } from "@/hooks/use-toast"

interface TokenPurchaseProps {
  currentPrice?: string
  amountRaised?: string
  tokenValue?: string
  progressPercentage?: string
  totalTokensForSale?: string
  totalTokensSold?: string
  saleActive?: boolean
}

// Contract ABI for the presale contract - UPDATED
const PRESALE_ABI = [
  // Buy function for ERC20 tokens (USDT, USDC)
  {
    "inputs": [
      {"name": "_token", "type": "address"},
      {"name": "_amount", "type": "uint256"}
    ],
    "name": "buyToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Buy function for ETH purchases
  {
    "inputs": [
      {"name": "_ethUsdPrice", "type": "uint256"},
      {"name": "_backendTimestamp", "type": "uint256"},
      {"name": "_backendSignature", "type": "bytes"}
    ],
    "name": "buyTokenWithEthPrice",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

// Contract address from Sepolia deployment - UPDATED
const PRESALE_CONTRACT_ADDRESS = "0x30e0c9c7e3661176595f1d2b1a1563a990ac0b0e";

// Helper function to get network name from chain ID
const getNetworkName = (chainId: number | undefined): string => {
  if (!chainId) return 'Unknown'
  switch (chainId) {
    case 1: return 'Ethereum Mainnet'
    case 11155111: return 'Sepolia Testnet'
    case 137: return 'Polygon'
    case 80001: return 'Mumbai Testnet'
    case 56: return 'BSC'
    case 97: return 'BSC Testnet'
    default: return `Chain ID ${chainId}`
  }
}

const currencyConfig = {
  ETH: { icon: EthIcon, color: "text-blue-400" },
  USDT: { icon: UsdtIcon, color: "text-green-500" },
  USDC: { icon: UsdcIcon, color: "text-blue-500" },
}

export default function TokenPurchaseNew({ 
  currentPrice = "$0.0010", 
  amountRaised = "$0", 
  tokenValue = "1 NWIS = $0.0010",
  progressPercentage = "0",
  totalTokensForSale = "1000000",
  totalTokensSold = "0",
  saleActive = false
}: TokenPurchaseProps) {
  // Client-side hydration fix
  const [mounted, setMounted] = useState(false)
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState<keyof typeof currencyConfig>("ETH")
  const [debouncedAmount, setDebouncedAmount] = useState("")
  const [timestamp, setTimestamp] = useState(BigInt(1735689600)) // Default timestamp
  
  // Live ETH price from API
  const { ethPrice, isLoading: isEthPriceLoading, error: ethPriceError } = useEthPrice()
  
  const [contractData, setContractData] = useState({
    totalTokensForSale: 0,
    totalTokensSold: 0,
    progressPercentage: "0",
    saleActive: false,
    currentTier: {
      index: 0,
      startAmount: 0,
      endAmount: 0,
      price: 0
    }
  })
  const [isLoadingContractData, setIsLoadingContractData] = useState(false)

  // ConnectKit modal hook
  const { setOpen } = useModal()

  // Check if wallet is on correct network (Sepolia)
  const isCorrectNetwork = chainId === 11155111 // Sepolia chain ID

  // Fetch contract data
  const fetchContractData = async () => {
    setIsLoadingContractData(true)
    try {
      const response = await fetch('/api/token-sale')
      if (response.ok) {
        const data = await response.json()
        const totalForSale = data.totalTokensForSale || "0"
        const totalSold = data.totalTokensSold || "0"
        
        // Convert from wei to tokens (divide by 10^18)
        const forSaleTokens = parseFloat(totalForSale) / 1e18
        const soldTokens = parseFloat(totalSold) / 1e18
        
        // Get current tier information
        const currentTier = data.currentTier || {
          index: "0",
          startAmount: "0",
          endAmount: "0",
          price: 0
        }
        
        // Convert tier amounts from wei to tokens
        const tierStartTokens = parseFloat(currentTier.startAmount) / 1e18
        const tierEndTokens = parseFloat(currentTier.endAmount) / 1e18
        
        // Calculate progress percentage
        const percentage = forSaleTokens > 0 ? ((soldTokens / forSaleTokens) * 100).toFixed(2) : "0"
        
        console.log('Contract data:', {
          rawTotalForSale: totalForSale,
          rawTotalSold: totalSold,
          convertedForSale: forSaleTokens,
          convertedSold: soldTokens,
          percentage,
          currentTier: {
            index: currentTier.index,
            startTokens: tierStartTokens,
            endTokens: tierEndTokens,
            price: currentTier.price
          }
        })
        
        setContractData({
          totalTokensForSale: forSaleTokens,
          totalTokensSold: soldTokens,
          progressPercentage: percentage,
          saleActive: data.saleActive || false,
          currentTier: {
            index: parseInt(currentTier.index),
            startAmount: tierStartTokens,
            endAmount: tierEndTokens,
            price: currentTier.price
          }
        })
      }
    } catch (error) {
      console.error('Error fetching contract data:', error)
    } finally {
      setIsLoadingContractData(false)
    }
  }

  // Only render on client to avoid hydration issues
  useEffect(() => {
    setMounted(true)
    setTimestamp(BigInt(Math.floor(Date.now() / 1000)))
    
    // Fetch contract data on mount
    fetchContractData()
  }, [])

  const { toast } = useToast()
  const { tokenAmount, isCalculating } = useTokenCalculation({ 
    amount: debouncedAmount, 
    currency,
    enabled: debouncedAmount !== "" && debouncedAmount === amount && contractData.saleActive // Only calculate when amounts match and sale is active
  })

  // Trigger calculation on Enter key or blur (clicking outside)
  const handleAmountSubmit = () => {
    if (amount && amount !== debouncedAmount) {
      setDebouncedAmount(amount)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAmountSubmit()
    }
  }

  const handleBlur = () => {
    handleAmountSubmit()
  }

  // Convert amount to wei for contract interaction
  const amountInWei = amount ? BigInt(Number.parseFloat(amount) * 1e18) : undefined

  // Get token addresses for ERC20 tokens
  const getTokenAddress = (currency: keyof typeof currencyConfig) => {
    switch (currency) {
      case "USDT":
        return "0x7169D38820dfd117C3FA1fD22e8Bf20e8Bf20e8B" // USDT address on Sepolia
      case "USDC":
        return "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" // USDC address on Sepolia
      case "ETH":
        return "0x0000000000000000000000000000000000000000" // ETH address (zero address)
      default:
        return "0x0000000000000000000000000000000000000000"
    }
  }

  // Simple simulation enabled state - only when user has submitted the amount
  const shouldSimulate = useMemo(() => 
    Boolean(amountInWei && isConnected && saleActive && debouncedAmount === amount),
    [amountInWei, isConnected, saleActive, debouncedAmount, amount]
  )



  // Wagmi hooks for ERC20 purchases
  const {
    data: simulationDataERC20,
    error: simulateErrorERC20,
    isLoading: isSimulatingERC20,
  } = useSimulateContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: PRESALE_ABI,
    functionName: "buyToken",
    args: [getTokenAddress(currency), amountInWei || BigInt(0)],
    query: { 
      enabled: shouldSimulate && currency !== "ETH" && debouncedAmount === amount 
    },
  })

  // Wagmi hooks for ETH purchases
  const {
    data: simulationDataETH,
    error: simulateErrorETH,
    isLoading: isSimulatingETH,
  } = useSimulateContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: PRESALE_ABI,
    functionName: "buyTokenWithEthPrice",
    args: [
      BigInt(Math.floor(ethPrice * 1e6)), // ETH price in smallest units (6 decimals)
      timestamp, // Current timestamp
      "0x" // Empty signature for now (backend verification disabled)
    ],
    value: amountInWei,
    query: { 
      enabled: shouldSimulate && currency === "ETH" && debouncedAmount === amount && contractData.saleActive
    },
  })

  // Use the appropriate simulation data based on currency
  const simulationData = currency === "ETH" ? simulationDataETH : simulationDataERC20
  const simulateError = currency === "ETH" ? simulateErrorETH : simulateErrorERC20
  const isSimulating = currency === "ETH" ? isSimulatingETH : isSimulatingERC20

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
    query: { enabled: true },
  })

  const isPurchasing = isWritePending || isCalculating || isSimulating || isConfirming

  // Effects

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
      // Refresh contract data after successful purchase
      fetchContractData()
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

  // Early returns
  if (!mounted) {
    return <TokenPurchaseSkeleton />
  }

  // Purchase handler
  const handlePurchase = async () => {
    if (!contractData.saleActive) {
      toast({
        title: "Sale Not Active",
        description: "The token sale is not currently active.",
        variant: "destructive",
      })
      return
    }
    
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

    if (!isCorrectNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Sepolia testnet to purchase tokens.",
        variant: "destructive",
      })
      return
    }
    
    // Note: Contract doesn't enforce min/max limits, so we removed those validations

    // Execute the purchase transaction
    if (writeContract && simulationData?.request) {
      writeContract(simulationData.request)
    } else {
      toast({
        title: "Transaction Not Ready",
        description: "Please wait for transaction simulation to complete.",
        variant: "destructive",
      })
    }
  }

  const handleCurrencyChange = (newCurrency: keyof typeof currencyConfig) => {
    setCurrency(newCurrency)
    // Reset amount when changing currency
    setAmount("")
    setDebouncedAmount("")
  }

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 sm:p-6">
      {/* Sale Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Sale Progress</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white font-medium">
              {isLoadingContractData ? (
                <div className="flex items-center gap-1">
                  <LoadingSpinner size="sm" />
                  Loading...
                </div>
              ) : (
                `${contractData.progressPercentage}%`
              )}
            </span>
            <Button
              onClick={fetchContractData}
              disabled={isLoadingContractData}
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0 bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </Button>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${contractData.progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>
            Current Tier: {isLoadingContractData ? "Loading..." : `Tier ${contractData.currentTier.index} ($${contractData.currentTier.price.toFixed(4)})`}
          </span>
          <span>
            Remaining Tier Tokens: {isLoadingContractData ? "Loading..." : `${(contractData.currentTier.endAmount - contractData.totalTokensSold).toLocaleString()} NWIS`}
          </span>
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

            const isSelected = currency === curr
            const borderClass = isSelected ? "border-2 border-white" : "border-2 border-gray-600"

            return (
              <Button
                key={curr}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => handleCurrencyChange(curr as keyof typeof currencyConfig)}
                disabled={isSimulating || !contractData.saleActive}
                className={`${buttonClasses} ${borderClass} flex items-center justify-center gap-2 text-sm py-2 px-4 min-w-[100px] h-10`}
              >
                {isSimulating && currency === curr ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Icon className={`h-4 w-4 ${isSelected ? "text-white" : color}`} />
                    {curr}
                  </>
                )}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
          Amount to Purchase
        </label>
        <div className="relative">
          <Input
            id="amount"
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              // Only allow numbers and decimal points
              const value = e.target.value
              if (value === "" || /^\d*\.?\d*$/.test(value)) {
                setAmount(value)
              }
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-full bg-gray-800 border-gray-600 text-white placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            disabled={!contractData.saleActive || isPurchasing}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
            {currency}
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          <span>Enter any amount to purchase NWIS tokens</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          💡 Type your amount - press Enter or click outside to calculate NWIS tokens
        </div>
        {amount !== debouncedAmount && (
          <div className="text-xs text-blue-400 mt-1">
            ⏳ Ready to calculate - press Enter or click outside
          </div>
        )}
        {amount === debouncedAmount && amount && (
          <div className="text-xs text-green-400 mt-1">
            ✅ Ready to simulate transaction
          </div>
        )}
      </div>

      {/* Token Calculation */}
      {amount && (
        <div className="mb-4 p-3 bg-gray-800 rounded-lg">
          {isCalculating ? (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <LoadingSpinner size="sm" />
              Calculating NWIS tokens...
            </div>
          ) : (
            <>
              <div className="text-sm text-gray-300">
                You will receive: <span className="text-white font-medium">{tokenAmount}</span> NWIS tokens
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Price: {currentPrice} per token
              </div>
            </>
          )}
        </div>
      )}

      {/* Network Warning */}
      {isConnected && !isCorrectNetwork && (
        <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg mb-3">
          <p className="text-sm text-red-400">
            <strong>⚠️ Wrong Network!</strong> Please switch to Sepolia testnet to purchase tokens.
          </p>
          <p className="text-xs text-red-300 mt-1">
            Current network: {getNetworkName(chainId)} | Required: Sepolia Testnet
          </p>
        </div>
      )}

      {/* Purchase Button */}
      <div className="space-y-3">
        {!isConnected ? (
          <Button
            onClick={() => setOpen(true)}
            className="w-full text-white font-medium py-3"
            style={{ backgroundColor: '#a57e24' }}
          >
            Connect Wallet
          </Button>
        ) : (
          <Button
            onClick={handlePurchase}
            disabled={!amount || !contractData.saleActive || isPurchasing || !simulationData || !isCorrectNetwork}
            className="w-full text-white font-medium py-3"
            style={{ backgroundColor: '#a57e24' }}
          >
            {isPurchasing ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                {isWritePending ? "Sending..." : isConfirming ? "Confirming..." : "Processing..."}
              </div>
            ) : !isCorrectNetwork ? (
              "Switch to Sepolia"
            ) : (
              `Purchase NWIS Tokens`
            )}
          </Button>
        )}

        {/* Error Display */}
        {simulateError && (
          <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
            <p className="text-sm text-red-400">
              <strong>Simulation Error:</strong> {simulateError.message}
            </p>
            <details className="mt-2">
              <summary className="text-xs text-red-300 cursor-pointer">Show Details</summary>
              <pre className="text-xs text-red-300 mt-1 overflow-auto">
                {simulateError.message}
              </pre>
            </details>
          </div>
        )}

        {/* Write Contract Error */}
        {writeError && (
          <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
            <p className="text-sm text-red-400">
              <strong>Transaction Error:</strong> {writeError.message}
            </p>
            <details className="mt-2">
              <summary className="text-xs text-red-300 cursor-pointer">Show Details</summary>
              <pre className="text-xs text-red-300 mt-1 overflow-auto">
                {writeError.message}
              </pre>
            </details>
          </div>
        )}

        {/* Success Display */}
        {isConfirmed && (
          <div className="p-3 bg-green-900/20 border border-green-700 rounded-lg">
            <p className="text-sm text-green-400">
              <strong>Success!</strong> Your purchase has been confirmed on the blockchain.
            </p>
          </div>
        )}

        {/* Reset Button for Stuck States */}
        {(isSimulating || isWritePending || isConfirming) && (
          <div className="p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
            <p className="text-sm text-yellow-400 mb-2">
              <strong>Processing...</strong> If this takes too long, you can reset:
            </p>
            <Button
              onClick={() => {
                setAmount("")
                setDebouncedAmount("")
              }}
              variant="outline"
              size="sm"
              className="bg-yellow-800 hover:bg-yellow-700 text-yellow-200 border-yellow-600"
            >
              Reset Form
            </Button>
          </div>
        )}
      </div>



      {/* Debug Info - Remove in production */}
      <div className="mt-4 p-2 bg-gray-800 rounded text-xs text-gray-400">
        <div>Contract: {PRESALE_CONTRACT_ADDRESS}</div>
        <div>Function: {currency === "ETH" ? "buyTokenWithEthPrice" : "buyToken"}</div>
        <div>Currency: {currency}</div>
        <div>Amount: {amount} {currency}</div>
                    {currency === "ETH" && (
              <div>
                ETH Price: ${ethPrice.toFixed(2)}
                {isEthPriceLoading && <span className="text-blue-400"> (updating...)</span>}
                {ethPriceError && <span className="text-red-400"> (error: {ethPriceError})</span>}
              </div>
            )}
        <div className="mt-2 pt-2 border-t border-gray-600">
          <div>Status: {isSimulating ? "Simulating..." : isWritePending ? "Sending..." : isConfirming ? "Confirming..." : "Ready"}</div>
          <div>Simulation: {simulateError ? "Failed" : simulationData ? "Success" : "Pending"}</div>
          <div>Write: {writeError ? "Failed" : isWritePending ? "Pending" : isWriteSuccess ? "Success" : "Not Started"}</div>
          <div>Network: {getNetworkName(chainId)} ({isCorrectNetwork ? '✅ Correct' : '❌ Wrong'})</div>
          <div>Current Tier: {contractData.currentTier.index} | Price: ${contractData.currentTier.price.toFixed(4)}</div>
        </div>
      </div>
    </div>
  )
}
