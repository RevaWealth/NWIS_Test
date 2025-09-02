"use client"

import { useState, useEffect, useMemo } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSimulateContract, useChainId, useReadContract } from "wagmi" 
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

// ERC20 ABI for token allowance and approval
const ERC20_ABI = [
  {
    "inputs": [
      {"name": "owner", "type": "address"},
      {"name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "spender", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
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
  totalTokensSold = "0"
}: TokenPurchaseProps) {
  // Client-side hydration fix
  const [mounted, setMounted] = useState(false)
  const { isConnected, address } = useAccount()
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

  // Token approval state
  const [tokenAllowance, setTokenAllowance] = useState<bigint>(BigInt(0))
  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false)
  const [isApproving, setIsApproving] = useState(false)


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



  // Check token allowance for ERC20 tokens from blockchain
  const checkTokenAllowance = async () => {
    if (currency === "ETH" || !amountInSmallestUnits || !address) return
    
    setIsCheckingAllowance(true)
    try {
      // Refetch allowance from blockchain
      await refetchAllowance()
    } catch (error) {
      console.error('Error checking token allowance:', error)
      setTokenAllowance(BigInt(0))

    } finally {
      setIsCheckingAllowance(false)
    }
  }

  // Approve tokens for spending
  const approveTokens = async () => {
    if (currency === "ETH" || !amountInSmallestUnits) return
    
    setIsApproving(true)
    try {
      const tokenAddress = getTokenAddress(currency)
      
      // Call the ERC20 approve function using writeApproveContract
      writeApproveContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [PRESALE_CONTRACT_ADDRESS, amountInSmallestUnits]
      })
      
      toast({
        title: "Approval Transaction Sent",
        description: "Approval transaction sent! Please confirm in your wallet.",
      })
      
    } catch (error) {
      console.error('Error approving tokens:', error)
      toast({
        title: "Approval Failed",
        description: error instanceof Error ? error.message : "Failed to approve tokens",
        variant: "destructive",
      })
      setIsApproving(false)
    }
  }

  // Only render on client to avoid hydration issues
  useEffect(() => {
    setMounted(true)
    setTimestamp(BigInt(Math.floor(Date.now() / 1000)))
  }, [])

  // Fetch contract data after component is mounted
  useEffect(() => {
    if (mounted) {
      fetchContractData()
    }
  }, [mounted])





  const { toast } = useToast()
  const { tokenAmount, isCalculating } = useTokenCalculation({ 
    amount: debouncedAmount, 
    currency,
    ethPrice: ethPrice,
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

  // Convert amount to smallest units based on currency
  const amountInSmallestUnits = amount ? (() => {
    if (currency === "ETH") {
      return BigInt(Number.parseFloat(amount) * 1e18) // ETH has 18 decimals
    } else if (currency === "USDT" || currency === "USDC") {
      return BigInt(Number.parseFloat(amount) * 1e6) // USDT/USDC have 6 decimals
    }
    return BigInt(Number.parseFloat(amount) * 1e18) // Default fallback
  })() : undefined

  // Get token addresses for ERC20 tokens
  const getTokenAddress = (currency: keyof typeof currencyConfig) => {
    switch (currency) {
      case "USDT":
        return "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0" // USDT address on Sepolia
      case "USDC":
        return "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8" // USDC address on Sepolia
      case "ETH":
        return "0x0000000000000000000000000000000000000000" // ETH address (zero address)
      default:
        return "0x0000000000000000000000000000000000000000"
    }
  }

  // Read token allowance from blockchain using useReadContract
  const { data: allowanceData, refetch: refetchAllowance, isLoading: isAllowanceLoading, error: allowanceError } = useReadContract({
    address: currency !== "ETH" ? getTokenAddress(currency) as `0x${string}` : undefined,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, PRESALE_CONTRACT_ADDRESS] : undefined,
    query: {
      enabled: currency !== "ETH" && !!address && !!amountInSmallestUnits,
    }
  })

  // Update allowance state when blockchain data changes
  useEffect(() => {
    console.log('Allowance effect triggered:', {
      allowanceData: allowanceData?.toString(),
      amountInSmallestUnits: amountInSmallestUnits?.toString(),
      currency,
      isAllowanceLoading,
      allowanceError: allowanceError?.message
    })
    
    if (allowanceData && amountInSmallestUnits) {
      console.log(`Allowance for ${currency}:`, allowanceData.toString())
      setTokenAllowance(allowanceData)
      
      // Log allowance status for debugging
      if (allowanceData >= amountInSmallestUnits) {
        console.log('Blockchain allowance sufficient for current amount')
      } else {
        console.log('Blockchain allowance insufficient, approval needed')
      }
    } else if (allowanceError) {
      console.log('Allowance error:', allowanceError.message)
    }
  }, [allowanceData, amountInSmallestUnits, currency, isAllowanceLoading, allowanceError])

  // Force allowance check when currency changes or component mounts
  useEffect(() => {
    if (mounted && currency !== "ETH" && address && amountInSmallestUnits) {
      console.log('Forcing allowance check on mount/currency change')
      setTimeout(() => {
        refetchAllowance()
      }, 500)
    }
  }, [mounted, currency, address, amountInSmallestUnits, refetchAllowance])

  // Wagmi hooks for ERC20 purchases
  const {
    data: simulationDataERC20,
    error: simulateErrorERC20,
    isLoading: isSimulatingERC20,
  } = useSimulateContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: PRESALE_ABI,
    functionName: "buyToken",
    args: [getTokenAddress(currency), amountInSmallestUnits || BigInt(0)],
    query: { 
      enabled: Boolean(
        amountInSmallestUnits && 
        isConnected && 
        contractData.saleActive && 
        debouncedAmount === amount &&
        currency !== "ETH"
      )
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
    value: amountInSmallestUnits,
    query: { 
      enabled: Boolean(
        amountInSmallestUnits && 
        isConnected && 
        contractData.saleActive && 
        debouncedAmount === amount &&
        currency === "ETH"
      )
    },
  })

  // Use the appropriate simulation data based on currency
  const simulationData = currency === "ETH" ? simulationDataETH : simulationDataERC20
  const simulateError = currency === "ETH" ? simulateErrorETH : simulateErrorERC20
  const isSimulating = currency === "ETH" ? isSimulatingETH : isSimulatingERC20

  // Debug simulation state
  useEffect(() => {
    if (simulateError) {
      console.error('Simulation Error Details:', {
        currency,
        error: simulateError,
        errorType: typeof simulateError,
        errorKeys: simulateError ? Object.keys(simulateError) : 'no keys',
        errorString: simulateError ? simulateError.toString() : 'no toString',
        amountInSmallestUnits: amountInSmallestUnits?.toString(),
        isConnected,
        contractData: contractData.saleActive,
        // Add more debugging info
        ethPrice,
        timestamp: timestamp?.toString(),
        tokenAddress: getTokenAddress(currency)
      })
    }
  }, [simulateError, currency, amountInSmallestUnits, isConnected, contractData.saleActive, ethPrice, timestamp])

  // Additional debug logging for simulation state
  useEffect(() => {
    console.log('Simulation Debug:', {
      currency,
      amountInSmallestUnits: amountInSmallestUnits?.toString(),
      isConnected,
      contractData: contractData.saleActive,
      debouncedAmount,
      amount,
      ethPrice,
      timestamp: timestamp?.toString(),
      // Simulation states
      isSimulatingERC20,
      isSimulatingETH,
      simulationDataERC20: !!simulationDataERC20,
      simulationDataETH: !!simulationDataETH,
      simulateErrorERC20: !!simulateErrorERC20,
      simulateErrorETH: !!simulateErrorETH
    })
  }, [currency, amountInSmallestUnits, isConnected, contractData.saleActive, debouncedAmount, amount, ethPrice, timestamp, isSimulatingERC20, isSimulatingETH, simulationDataERC20, simulationDataETH, simulateErrorERC20, simulateErrorETH])

  // Type-safe simulation data for the current currency
  const currentSimulationData = currency === "ETH" ? simulationDataETH : simulationDataERC20

  // Separate write contract hooks for approval and purchase
  const {
    data: approveHash,
    writeContract: writeApproveContract,
    isPending: isApprovePending,
    isSuccess: isApproveSuccess,
    isError: isApproveError,
    error: approveError,
  } = useWriteContract()

  const {
    data: purchaseHash,
    writeContract: writePurchaseContract,
    isPending: isPurchasePending,
    isSuccess: isPurchaseSuccess,
    isError: isPurchaseError,
    error: purchaseError,
  } = useWriteContract()

  // Track what type of transaction we're executing
  const [isExecutingApproval, setIsExecutingApproval] = useState(false)

  // Check if approval is needed based on actual blockchain allowance
  const needsApproval = useMemo(() => {
    if (currency === "ETH") return false
    if (!amountInSmallestUnits) return false
    
    // If we don't have allowance data yet, check if we have a cached allowance
    if (!allowanceData) {
      const cachedAllowance = tokenAllowance
      if (cachedAllowance > BigInt(0)) {
        const result = cachedAllowance < amountInSmallestUnits || isApprovePending
        console.log('needsApproval calculation (using cached):', {
          currency,
          amountInSmallestUnits: amountInSmallestUnits?.toString(),
          cachedAllowance: cachedAllowance.toString(),
          isApprovePending,
          allowanceSufficient: cachedAllowance >= amountInSmallestUnits,
          result
        })
        return result
      }
      return true // No allowance data available, assume approval needed
    }
    
    // Check if blockchain allowance is sufficient for the current amount
    const result = allowanceData < amountInSmallestUnits || isApprovePending
    console.log('needsApproval calculation (using blockchain):', {
      currency,
      amountInSmallestUnits: amountInSmallestUnits?.toString(),
      blockchainAllowance: allowanceData?.toString(),
      isApprovePending,
      allowanceSufficient: allowanceData >= amountInSmallestUnits,
      result
    })
    return result
  }, [currency, amountInSmallestUnits, allowanceData, tokenAllowance, isApprovePending])

  // Enhanced simulation enabled state - includes approval checking
  const shouldSimulate = useMemo(() => {
    // For ETH, no approval needed
    if (currency === "ETH") {
      const result = Boolean(
        amountInSmallestUnits && 
        isConnected && 
        contractData.saleActive && 
        debouncedAmount === amount
      )
      console.log('shouldSimulate calculation (ETH):', {
        amountInSmallestUnits: amountInSmallestUnits?.toString(),
        isConnected,
        contractData: contractData.saleActive,
        debouncedAmount,
        amount,
        result
      })
      return result
    }
    
    // For ERC20 tokens, check if approval is needed
    if (!amountInSmallestUnits || !isConnected || !contractData.saleActive || debouncedAmount !== amount) {
      console.log('shouldSimulate calculation (ERC20 - basic conditions not met):', {
        amountInSmallestUnits: amountInSmallestUnits?.toString(),
        isConnected,
        contractData: contractData.saleActive,
        debouncedAmount,
        amount,
        result: false
      })
      return false
    }
    
    // Check if approval is pending
    if (isApprovePending) {
      console.log('shouldSimulate calculation (ERC20 - approval pending):', {
        isApprovePending,
        result: false
      })
      return false
    }
    
    // Check if we have sufficient allowance
    let hasSufficientAllowance = false
    if (allowanceData) {
      hasSufficientAllowance = allowanceData >= amountInSmallestUnits
    } else if (tokenAllowance > BigInt(0)) {
      hasSufficientAllowance = tokenAllowance >= amountInSmallestUnits
    }
    
    const result = hasSufficientAllowance
    console.log('shouldSimulate calculation (ERC20 - allowance check):', {
      amountInSmallestUnits: amountInSmallestUnits?.toString(),
      allowanceData: allowanceData?.toString(),
      tokenAllowance: tokenAllowance.toString(),
      hasSufficientAllowance,
      result
    })
    return result
  }, [amountInSmallestUnits, isConnected, contractData.saleActive, debouncedAmount, amount, currency, isApprovePending, allowanceData, tokenAllowance])

  // Debug state changes
  useEffect(() => {
    console.log('State changed:', {
      tokenAllowance: tokenAllowance.toString(),
      isApproving,
      isExecutingApproval
    })
  }, [tokenAllowance, isApproving, isExecutingApproval])

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isConfirmationError,
    error: confirmationError,
  } = useWaitForTransactionReceipt({
    hash: purchaseHash,
    query: { enabled: !!purchaseHash }, // Only wait for purchase transactions
  })

  const isPurchasing = isPurchasePending || isCalculating || isSimulating || isConfirming

  // Effects

  useEffect(() => {
    if (isPurchaseSuccess) {
      toast({
        title: "Transaction Sent",
        description: `Transaction sent! Waiting for confirmation... Hash: ${purchaseHash?.slice(0, 6)}...`,
      })
    }
    if (isPurchaseError) {
      toast({
        title: "Purchase Failed",
        description: purchaseError?.message || "An unknown error occurred during purchase.",
        variant: "destructive",
      })
    }
  }, [isPurchaseSuccess, isPurchaseError, purchaseError, purchaseHash, toast])

  useEffect(() => {
    if (isConfirmed) {
      // This is a purchase confirmation
      toast({
        title: "Purchase Confirmed",
        description: `Your purchase of ${tokenAmount} NWIS tokens is confirmed!`,
      })
      
      // Reset all component state
      resetComponentState()
      
      // Refresh contract data after successful purchase
      fetchContractData()
      
      // Refresh allowance from blockchain for next purchase
      if (currency !== "ETH") {
        setTimeout(() => {
          console.log('Refreshing allowance after successful purchase...')
          refetchAllowance()
          checkTokenAllowance()
        }, 2000) // Wait for blockchain to update
      }
      
      console.log('Purchase confirmed - reset all states and refreshed data')
    }
    if (isConfirmationError) {
      toast({
        title: "Transaction Failed",
        description: confirmationError?.message || "Transaction confirmation failed.",
        variant: "destructive",
      })
    }
  }, [isConfirmed, isConfirmationError, confirmationError, tokenAmount, toast, currency, refetchAllowance])

  // Handle approval transaction success
  useEffect(() => {
    console.log('Approval success handler triggered:', {
      isApproveSuccess,
      approveHash,
      amountInSmallestUnits: amountInSmallestUnits?.toString()
    })
    
    if (isApproveSuccess && approveHash) {
      // This was an approval transaction
      console.log('Processing approval success...')
      
      toast({
        title: "Approval Success",
        description: "Tokens approved! You can now purchase.",
      })
      
      // Reset the approval state
      setIsApproving(false)
      
      // Immediately refresh allowance from blockchain
      refetchAllowance()
      
      // Force a manual allowance check to update local state
      setTimeout(() => {
        console.log('Forcing manual allowance check...')
        checkTokenAllowance()
      }, 1000)
      
      // Also refresh again after a short delay to ensure blockchain state is updated
      const refreshTimer = setTimeout(() => {
        console.log('Refreshing allowance again after delay...')
        refetchAllowance()
        // Force another manual check
        checkTokenAllowance()
      }, 3000)
      
      console.log('Approval success - immediately refreshed allowance and scheduled another refresh')
      
      // Cleanup timer
      return () => clearTimeout(refreshTimer)
    }
  }, [isApproveSuccess, approveHash, amountInSmallestUnits, toast, refetchAllowance])

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

  // Purchase handler with automatic approval check
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
    if (writePurchaseContract && simulationData?.request) {
      writePurchaseContract(simulationData.request)
    } else {
      toast({
        title: "Transaction Not Ready",
        description: "Please wait for transaction simulation to complete.",
        variant: "destructive",
      })
    }
  }



  // Function to reset all component state
  const resetComponentState = () => {
    setAmount("")
    setDebouncedAmount("")
    setTokenAllowance(BigInt(0))
    setIsApproving(false)
    setIsCheckingAllowance(false)
    console.log('Component state reset completed')
  }

  const handleCurrencyChange = (newCurrency: keyof typeof currencyConfig) => {
    setCurrency(newCurrency)
    // Reset amount when changing currency
    setAmount("")
    setDebouncedAmount("")
    // Reset allowance state when changing currency
    setTokenAllowance(BigInt(0))
    
    // Clear any existing allowance data to force fresh blockchain check
    if (newCurrency !== "ETH") {
      setTimeout(() => {
        refetchAllowance()
      }, 100)
    }
  }

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 sm:p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-400">Loading...</span>
        </div>
      </div>
    )
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
                `${contractData.progressPercentage || "0"}%`
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
            style={{ width: `${contractData.progressPercentage || "0"}%` }}
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
            onClick={() => {
              console.log('Button clicked:', {
                needsApproval,
                amountInSmallestUnits: amountInSmallestUnits?.toString(),
                currency
              })
              if (needsApproval) {
                approveTokens()
              } else {
                handlePurchase()
              }
            }}
            disabled={!amount || !contractData.saleActive || isPurchasing || (!needsApproval && !simulationData) || !isCorrectNetwork}
            className="w-full text-white font-medium py-3"
            style={{ backgroundColor: needsApproval ? '#3b82f6' : '#a57e24' }}
            title={`Debug: amount=${!!amount}, saleActive=${contractData.saleActive}, isPurchasing=${isPurchasing}, needsApproval=${needsApproval}, simulationData=${!!simulationData}, isCorrectNetwork=${isCorrectNetwork}`}
          >
            {isPurchasing ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                {isApprovePending ? "Approving..." : (isPurchasePending ? "Sending..." : isConfirming ? "Confirming..." : "Processing...")}
              </div>
            ) : !isCorrectNetwork ? (
              "Switch to Sepolia"
            ) : needsApproval ? (
              `Approve ${currency}`
            ) : (
              "Buy NWIS Tokens"
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
        {(approveError || purchaseError) && (
          <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
            <p className="text-sm text-red-400">
              <strong>Transaction Error:</strong> {approveError?.message || purchaseError?.message}
            </p>
            <details className="mt-2">
              <summary className="text-xs text-red-300 cursor-pointer">Show Details</summary>
              <pre className="text-xs text-red-300 mt-1 overflow-auto">
                {approveError?.message || purchaseError?.message}
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
        {(isSimulating || isApprovePending || isPurchasePending || isConfirming) && (
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

        {/* Debug Info - Button State */}
        <div className="mt-4 p-3 bg-gray-800 rounded text-xs text-gray-400">
          <div><strong>Button State Debug:</strong></div>
          <div>Amount: {amount ? "✅" : "❌"} ({amount || "empty"})</div>
          <div>Sale Active: {contractData.saleActive ? "✅" : "❌"}</div>
          <div>Is Purchasing: {isPurchasing ? "❌" : "✅"}</div>
          <div>Needs Approval: {needsApproval ? "🔐" : "✅"}</div>
          <div>Simulation Data: {simulationData ? "✅" : "❌"}</div>
          <div>Correct Network: {isCorrectNetwork ? "✅" : "❌"}</div>
          <div>Currency: {currency}</div>
          <div>Debounced Amount: {debouncedAmount}</div>
          <div>Should Simulate: {"✅"}</div>
          <div>Amount In Smallest Units: {amountInSmallestUnits?.toString() || "undefined"}</div>
          <div>Is Connected: {isConnected ? "✅" : "❌"}</div>
          <div>Is Simulating: {isSimulating ? "🔄" : "⏸️"}</div>
          
          {/* Allowance Debug Info */}
          <div className="mt-2 p-2 bg-blue-900/20 border border-blue-700 rounded">
            <div><strong>Allowance Debug:</strong></div>
            <div>Blockchain Allowance: {allowanceData?.toString() || "undefined"}</div>
            <div>Cached Allowance: {tokenAllowance.toString()}</div>
            <div>Allowance Loading: {isAllowanceLoading ? "🔄" : "⏸️"}</div>
            <div>Allowance Error: {allowanceError?.message || "none"}</div>
            <div>Is Approve Pending: {isApprovePending ? "🔄" : "⏸️"}</div>
          </div>
          
          {simulateError && (
            <div className="mt-2 p-2 bg-red-900/20 border border-red-700 rounded">
              <div><strong>Simulation Error:</strong></div>
              <div className="text-red-400">{simulateError.message}</div>
            </div>
          )}
          
          {/* Manual Allowance Check Button */}
          {currency !== "ETH" && (
            <div className="mt-2">
              <Button
                onClick={() => {
                  console.log('Manual allowance check triggered')
                  refetchAllowance()
                }}
                variant="outline"
                size="sm"
                className="bg-blue-800 hover:bg-blue-700 text-blue-200 border-blue-600"
                disabled={isAllowanceLoading}
              >
                {isAllowanceLoading ? "Checking..." : "Refresh Allowance"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
