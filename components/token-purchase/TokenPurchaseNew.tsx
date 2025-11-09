"use client"

import { useState, useEffect, useLayoutEffect, useMemo, useCallback } from "react"
import { useAccount, useSimulateContract, useChainId, useReadContract, useSwitchChain, useBalance } from "wagmi" 
import { useModal } from "connectkit"
import { useToast } from "@/hooks/use-toast"
import { useTokenCalculation } from "@/hooks/use-token-calculation"
import { useEthPrice } from "@/hooks/use-eth-price"
import { useContractData } from "@/hooks/use-contract-data"
import { useTokenApproval } from "@/hooks/use-token-approval"
import { useTransactionConfirmation } from "@/hooks/use-transaction-confirmation"

// Components
import { ProgressBar } from "./ProgressBar"
import { CurrencySelector } from "./CurrencySelector"
import { AmountInput } from "./AmountInput"
import { NwisAmountInput } from "./NwisAmountInput"
import { PurchaseButton } from "./PurchaseButton"
import { NetworkWarning } from "./NetworkWarning"
import { NetworkSwitchDialog } from "./dialogs/NetworkSwitchDialog"
import { TransactionConfirmationDialog } from "./dialogs/TransactionConfirmationDialog"
import { TokenPurchaseAgreementDialog } from "./dialogs/TokenPurchaseAgreementDialog"
import { MobileApprovalBanner } from "../MobileApprovalBanner"
import { TokenPurchaseSkeleton } from "@/component/loading-skeleton"

// Constants and types
import { PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, REQUIRED_NETWORK } from "@/lib/constants"
import { getTokenAddress, convertToSmallestUnits, calculateNwisFromAmount, formatNumber, isMobileDevice } from "@/lib/token-purchase-utils"
import { isWalletBrowser, isMobileWalletBrowser } from "@/lib/wallet-browser-utils"
import { TokenPurchaseProps, Currency, ContractData } from "@/lib/types"

function TokenPurchaseNew({ 
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
  const { switchChain } = useSwitchChain()
  const { setOpen } = useModal()
  const { toast } = useToast()

  // Form state
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState<Currency>("ETH")
  const [debouncedAmount, setDebouncedAmount] = useState("")
  const [nwisTokenAmount, setNwisTokenAmount] = useState("")
  const [debouncedNwisTokenAmount, setDebouncedNwisTokenAmount] = useState("")
  const [timestamp, setTimestamp] = useState(BigInt(Math.floor(Date.now() / 1000)))

  // Dialog state
  const [showNetworkDialog, setShowNetworkDialog] = useState(false)
  const [showTPADialog, setShowTPADialog] = useState(false)
  const [hasAgreedToTPA, setHasAgreedToTPA] = useState(false)
  
  // Mobile approval banner state
  const [showMobileApprovalBanner, setShowMobileApprovalBanner] = useState(false)
  const isWallet = isWalletBrowser()
  const isMobileWallet = isMobileWalletBrowser()

  // Custom hooks
  const { ethPrice, isLoading: isEthPriceLoading, error: ethPriceError } = useEthPrice()
  const { contractData, isLoadingContractData, fetchContractData } = useContractData()
  
  // Wallet balance checks - always fetch when connected to have balances ready
  const { data: ethBalance, isLoading: isEthBalanceLoading } = useBalance({
    address: address,
    query: {
      enabled: isConnected && !!address
    }
  })
  
  const { data: usdtBalance, isLoading: isUsdtBalanceLoading } = useReadContract({
    address: isConnected && address ? (getTokenAddress("USDT") as `0x${string}`) : undefined,
    abi: [
      {
        "inputs": [{"name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address
    }
  })
  
  const { data: usdcBalance, isLoading: isUsdcBalanceLoading } = useReadContract({
    address: isConnected && address ? (getTokenAddress("USDC") as `0x${string}`) : undefined,
    abi: [
      {
        "inputs": [{"name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address
    }
  })
  
  const { tokenAmount, isCalculating } = useTokenCalculation({ 
    amount: amount, 
    currency,
    ethPrice: ethPrice,
    currentTierPrice: contractData.currentTier?.price || 0.001,
    enabled: amount !== "" && contractData.saleActive && !isLoadingContractData
  })


  // Sync NWIS amount when tokenAmount changes
  useEffect(() => {
    if (amount && tokenAmount) {
      handleSyncFromAmount()
    }
  }, [tokenAmount, amount])

  // Fetch contract data on mount
  useEffect(() => {
    fetchContractData()
  }, [fetchContractData])


  // Token approval hook
  const {
    needsApproval,
    isApprovalPending,
    localIsApproving,
    approveTokens,
    refetchAllowance
  } = useTokenApproval(currency, amount)

  // Transaction confirmation hook
  const {
    transactionHash,
    isTransactionConfirmed,
    showTransactionDialog,
    transactionDetails,
    isPurchasing,
    isConfirmed,
    handlePurchase: handlePurchaseTransaction,
    handleConfirmTransaction,
    handleCloseTransactionDialog,
    setShowTransactionDialog,
    setTransactionDetails
  } = useTransactionConfirmation({
    currency,
    amount,
    ethPrice: ethPrice || 0,
    timestamp,
    contractData,
    tokenAmount: tokenAmount || "0",
    onShowMobileBanner: () => setShowMobileApprovalBanner(true)
  })

  // Network validation
  const isCorrectNetwork = chainId === REQUIRED_NETWORK

  // Convert amount to smallest units
  const amountInSmallestUnits = useMemo(() => {
    return convertToSmallestUnits(amount, currency)
  }, [amount, currency])

  // Simulation for ERC20 tokens
  const {
    data: simulationDataERC20,
    error: simulateErrorERC20,
    isLoading: isSimulatingERC20,
  } = useSimulateContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: PRESALE_ABI,
    functionName: "buyToken",
    args: [getTokenAddress(currency) as `0x${string}`, amountInSmallestUnits || BigInt(0)],
    query: { 
      enabled: Boolean(
        amountInSmallestUnits && 
        isConnected && 
        contractData.saleActive && 
        debouncedAmount === amount &&
        currency !== "ETH"
      ),
    },
  })

  // Simulation for ETH purchases
  const {
    data: simulationDataETH,
    error: simulateErrorETH,
    isLoading: isSimulatingETH,
  } = useSimulateContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: PRESALE_ABI,
    functionName: "buyTokenWithEthPrice",
    args: [
      BigInt(Math.floor((ethPrice || 0) * 1e6)),
      timestamp,
      "0x"
    ],
    value: amountInSmallestUnits,
    query: { 
      enabled: Boolean(
        amountInSmallestUnits && 
        isConnected && 
        contractData.saleActive && 
        amount && // Changed from debouncedAmount === amount to just amount
        currency === "ETH"
      )
    },
  })

  // Use appropriate simulation data
  const simulationData = currency === "ETH" ? simulationDataETH : simulationDataERC20
  const simulateError = currency === "ETH" ? simulateErrorETH : simulateErrorERC20
  const isSimulating = currency === "ETH" ? isSimulatingETH : isSimulatingERC20


  // Debug simulation state
  useEffect(() => {
    console.log('Simulation Debug:', {
      currency,
      needsApproval,
      simulationData: !!simulationData,
      simulationDataETH: !!simulationDataETH,
      simulationDataERC20: !!simulationDataERC20,
      isSimulating,
      isSimulatingETH,
      isSimulatingERC20,
      simulateError: !!simulateError,
      simulateErrorETH: !!simulateErrorETH,
      simulateErrorERC20: !!simulateErrorERC20,
      amountInSmallestUnits: amountInSmallestUnits?.toString(),
      isConnected,
      saleActive: contractData.saleActive,
      debouncedAmount,
      amount,
      ethPrice,
      timestamp: timestamp.toString()
    })
  }, [currency, needsApproval, simulationData, simulationDataETH, simulationDataERC20, isSimulating, isSimulatingETH, isSimulatingERC20, simulateError, simulateErrorETH, simulateErrorERC20, amountInSmallestUnits, isConnected, contractData.saleActive, debouncedAmount, amount, ethPrice, timestamp])

  // Get pay amount for ERC20 tokens
  const getPayAmountArgs = useMemo(() => {
    if (!debouncedNwisTokenAmount || currency === "ETH") return undefined
    const parsedAmount = Number.parseFloat(debouncedNwisTokenAmount)
    if (isNaN(parsedAmount) || !isFinite(parsedAmount) || parsedAmount <= 0) {
      return undefined
    }
    return [getTokenAddress(currency) as `0x${string}`, BigInt(Math.floor(parsedAmount * 1e18))] as const
  }, [debouncedNwisTokenAmount, currency])

  const { data: payAmountData, isLoading: isPayAmountLoading, error: payAmountError } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: PRESALE_ABI,
    functionName: "getPayAmount",
    args: getPayAmountArgs,
    query: {
      enabled: Boolean(getPayAmountArgs && contractData.saleActive && currency !== "ETH" && isConnected),
    }
  })

  // Calculate ETH pay amount
  const ethPayAmount = useMemo(() => {
    if (currency === "ETH" && debouncedNwisTokenAmount && ethPrice && !isEthPriceLoading) {
      const parsedNwisAmount = Number.parseFloat(debouncedNwisTokenAmount)
      if (isNaN(parsedNwisAmount) || !isFinite(parsedNwisAmount) || parsedNwisAmount <= 0) {
        return null
      }
      const nwisAmountInWei = BigInt(Math.floor(parsedNwisAmount * 1e18))
      const currentTierPrice = 0.001
      const usdValue = Number(nwisAmountInWei) / 1e18 * currentTierPrice
      const ethAmount = usdValue / ethPrice
      return ethAmount
    }
    return null
  }, [currency, debouncedNwisTokenAmount, ethPrice, isEthPriceLoading])

  // Convert pay amount to readable format
  const payAmount = useMemo(() => {
    if (currency === "ETH") {
      return ethPayAmount ? ethPayAmount.toFixed(6) : null
    } else if (payAmountData) {
      if (currency === "USDT" || currency === "USDC") {
        return (Number(payAmountData) / 1e6).toFixed(2)
      }
      return payAmountData.toString()
    }
    return null
  }, [currency, ethPayAmount, payAmountData])
  
  // Format wallet balance for display - always show when connected, even if zero
  const formattedWalletBalance = useMemo(() => {
    if (!isConnected) return null
    
    if (currency === "ETH") {
      if (isEthBalanceLoading) return "Loading..."
      if (!ethBalance) return "0.000000"
      const balanceInEth = Number(ethBalance.value) / 1e18
      return balanceInEth.toFixed(6)
    } else if (currency === "USDT") {
      if (isUsdtBalanceLoading) return "Loading..."
      if (!usdtBalance) return "0.00"
      const balanceInUsdt = Number(usdtBalance) / 1e6
      return balanceInUsdt.toFixed(2)
    } else if (currency === "USDC") {
      if (isUsdcBalanceLoading) return "Loading..."
      if (!usdcBalance) return "0.00"
      const balanceInUsdc = Number(usdcBalance) / 1e6
      return balanceInUsdc.toFixed(2)
    }
    
    return null
  }, [currency, ethBalance, usdtBalance, usdcBalance, isConnected, isEthBalanceLoading, isUsdtBalanceLoading, isUsdcBalanceLoading])
  
  // Check if balance is insufficient
  const hasInsufficientBalance = useMemo(() => {
    // Always check against the amount the user entered (what they want to spend)
    if (!amount || !isConnected) return false
    
    const parsedAmount = Number.parseFloat(amount)
    if (isNaN(parsedAmount) || !isFinite(parsedAmount) || parsedAmount <= 0) return false
    
    // Check if balance is still loading - if so, don't disable yet
    if (currency === "ETH") {
      if (isEthBalanceLoading) return false
      // If balance data exists (even if zero), check it
      if (ethBalance !== undefined) {
        const balanceInEth = Number(ethBalance.value) / 1e18
        return parsedAmount > balanceInEth
      }
      // If balance is not loaded yet, don't show insufficient balance
      return false
    } else if (currency === "USDT") {
      if (isUsdtBalanceLoading) return false
      // If balance data exists (even if zero), check it
      if (usdtBalance !== undefined) {
        const balanceInUsdt = Number(usdtBalance) / 1e6
        return parsedAmount > balanceInUsdt
      }
      return false
    } else if (currency === "USDC") {
      if (isUsdcBalanceLoading) return false
      // If balance data exists (even if zero), check it
      if (usdcBalance !== undefined) {
        const balanceInUsdc = Number(usdcBalance) / 1e6
        return parsedAmount > balanceInUsdc
      }
      return false
    }
    
    return false
  }, [amount, currency, ethBalance, usdtBalance, usdcBalance, isConnected, isEthBalanceLoading, isUsdtBalanceLoading, isUsdcBalanceLoading])

  // Effects
  useLayoutEffect(() => {
    setMounted(true)
    setTimestamp(BigInt(Math.floor(Date.now() / 1000)))
  }, [])

  useEffect(() => {
    if (mounted && ethPrice && !isEthPriceLoading) {
      // Use setTimeout to defer the state update to avoid hydration issues
      const timer = setTimeout(() => {
        setTimestamp(BigInt(Math.floor(Date.now() / 1000)))
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [mounted, ethPrice, isEthPriceLoading])

  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        fetchContractData()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [mounted, fetchContractData])

  useEffect(() => {
    if (!mounted) return
    
    const timer = setTimeout(() => {
      setDebouncedNwisTokenAmount(nwisTokenAmount)
    }, 3000)

    return () => clearTimeout(timer)
  }, [mounted, nwisTokenAmount])

  useEffect(() => {
    if (isConnected && !isCorrectNetwork && mounted) {
      setShowNetworkDialog(true)
    } else if (isCorrectNetwork) {
      setShowNetworkDialog(false)
    }
  }, [isConnected, isCorrectNetwork, mounted])

  useEffect(() => {
    if (mounted && payAmount && debouncedNwisTokenAmount && !amount) {
      // Use setTimeout to defer the state update to avoid hydration issues
      const timer = setTimeout(() => {
        setAmount(payAmount)
        setDebouncedAmount(payAmount)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [mounted, payAmount, debouncedNwisTokenAmount, amount])


  // Event handlers
  const handleAmountSubmit = () => {
    if (amount && amount !== debouncedAmount) {
      setDebouncedAmount(amount)
    }
    handleSyncFromAmount()
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

  const handleNwisAmountSubmit = () => {
    if (nwisTokenAmount && nwisTokenAmount !== debouncedNwisTokenAmount) {
      setDebouncedNwisTokenAmount(nwisTokenAmount)
    }
    handleSyncFromNwis()
  }

  const handleNwisKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleNwisAmountSubmit()
    }
  }

  const handleNwisBlur = () => {
    handleNwisAmountSubmit()
  }

  const handleSyncFromAmount = () => {
    console.log('handleSyncFromAmount called:', { tokenAmount, debouncedAmount, amount, currency, ethPrice })
    
    if (amount && tokenAmount) {
      if (amount !== debouncedAmount) {
        setDebouncedAmount(amount)
      }
      
      // Use the tokenAmount from useTokenCalculation hook instead of calculateNwisFromAmount
      setNwisTokenAmount(tokenAmount)
      setDebouncedNwisTokenAmount(tokenAmount)
      console.log('NWIS Amount field populated with:', tokenAmount)
    }
  }

  const handleSyncFromNwis = () => {
    if (payAmount && debouncedNwisTokenAmount) {
      setAmount(payAmount)
      setDebouncedAmount(payAmount)
    }
  }

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency)
    setAmount("")
    setDebouncedAmount("")
    setNwisTokenAmount("")
    setDebouncedNwisTokenAmount("")
    
    if (newCurrency !== "ETH") {
      setTimeout(() => {
        refetchAllowance()
      }, 100)
    }
  }

  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: REQUIRED_NETWORK })
      setShowNetworkDialog(false)
    } catch (error) {
      console.error('Failed to switch network:', error)
      
      if (isMobileDevice()) {
        toast({
          title: "Manual Network Switch Required",
          description: "Please manually switch to Ethereum Mainnet in your wallet app. Look for 'Networks' or 'Settings' in your wallet.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Network Switch Failed",
          description: "Please switch to Ethereum Mainnet manually in your wallet.",
          variant: "destructive",
        })
      }
    }
  }

  const handlePurchase = () => {
    if (!contractData.saleActive) {
      toast({
        title: "Sale Not Active",
        description: "The token sale is not currently active.",
        variant: "destructive",
      })
      return
    }
    
    const parsedAmount = Number.parseFloat(amount || "0")
    if (!amount || isNaN(parsedAmount) || !isFinite(parsedAmount) || parsedAmount <= 0) {
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
        description: "Please switch to Ethereum mainnet to purchase tokens.",
        variant: "destructive",
      })
      return
    }

    // Use simulation data for gas estimate if available, otherwise use default
    const gasEstimate = simulationData?.request?.gas ? (Number(simulationData.request.gas) * 20e9 / 1e18).toFixed(6) : "0.001"
    const nwisAmount = debouncedNwisTokenAmount || nwisTokenAmount || "0"
    
    setTransactionDetails({
      amountPaid: amount,
      gasEstimate: gasEstimate,
      nwisAmount: nwisAmount,
      contractAddress: PRESALE_CONTRACT_ADDRESS,
      buyerAddress: address || "",
      currency: currency
    })
    
    setShowTransactionDialog(true)
  }

  // Handle approval
  const handleApprove = () => {
    // Show mobile banner if on mobile device or mobile wallet browser
    if (isMobileDevice() || isMobileWallet) {
      setShowMobileApprovalBanner(true)
    }
    
    // Call the original approval function
    approveTokens()
  }

  const handleCloseTPADialog = () => {
    setShowTPADialog(false)
  }

  const handleAgreeToTPA = () => {
    setHasAgreedToTPA(true)
    setShowTPADialog(false)
    // Banner will be triggered by handlePurchase when Buy NWIS button is pressed
  }

  // Early returns
  if (!mounted) {
    return <TokenPurchaseSkeleton />
  }

  return (
    <>
      <div className={`bg-gray-900/50 border border-gray-700 rounded-lg ${isWallet ? 'p-3' : 'p-4 sm:p-6'}`}>
        {/* Sale Progress */}
        <ProgressBar 
          contractData={contractData} 
          isLoadingContractData={isLoadingContractData} 
        />

        {/* Currency Selection */}
        <CurrencySelector
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
          isSimulating={isSimulating}
          saleActive={contractData.saleActive}
        />

        {/* Live ETH Price Display */}
        {currency === "ETH" && (
          <div className="mb-4 text-center">
            <div className="text-sm text-gray-400">
              {isEthPriceLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading ETH price...</span>
                </div>
              ) : ethPriceError ? (
                <span className="text-red-400">Error loading ETH price</span>
              ) : (
                <span>Current ETH Price: <span className="text-white font-medium">${ethPrice?.toFixed(2)}</span></span>
              )}
            </div>
          </div>
        )}

        {/* Amount Input */}
        <AmountInput
          amount={amount}
          currency={currency}
          onAmountChange={setAmount}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          saleActive={contractData.saleActive}
          isPurchasing={isPurchasing}
          debouncedAmount={debouncedAmount}
          walletBalance={formattedWalletBalance}
          isConnected={isConnected}
        />

        {/* NWIS Amount Input */}
        <NwisAmountInput
          nwisTokenAmount={nwisTokenAmount}
          onNwisAmountChange={setNwisTokenAmount}
          onKeyDown={handleNwisKeyDown}
          onBlur={handleNwisBlur}
          saleActive={contractData.saleActive}
          isPurchasing={isPurchasing}
          debouncedNwisTokenAmount={debouncedNwisTokenAmount}
          isPayAmountLoading={isPayAmountLoading}
          isEthPriceLoading={isEthPriceLoading}
          payAmountError={payAmountError}
          currency={currency}
          isConnected={isConnected}
        />

        {/* Network Warning */}
        <NetworkWarning
          isConnected={isConnected}
          isCorrectNetwork={isCorrectNetwork}
          chainId={chainId}
        />

        {/* Success Display */}
        {isConfirmed && (
          <div className="p-3 bg-green-900/20 border border-green-700 rounded-lg">
            <p className="text-sm text-green-400">
              <strong>Success!</strong> Your purchase has been confirmed on the blockchain.
            </p>
          </div>
        )}
      </div>
      
      {/* Purchase Button */}
      <div className="mt-6 space-y-3">
        <PurchaseButton
          isConnected={isConnected}
          onConnect={() => setOpen(true)}
          onPurchase={handlePurchase}
          onApprove={handleApprove}
          needsApproval={needsApproval}
          currency={currency}
          amount={amount}
          saleActive={contractData.saleActive}
          isPurchasing={isPurchasing}
          localIsApproving={localIsApproving}
          isApprovalPending={isApprovalPending}
          simulationData={simulationData}
          isCorrectNetwork={isCorrectNetwork}
          hasInsufficientBalance={hasInsufficientBalance}
        />
      </div>
      
      {/* Dialogs */}
      <NetworkSwitchDialog
        open={showNetworkDialog}
        onOpenChange={setShowNetworkDialog}
        chainId={chainId}
        onSwitchNetwork={handleSwitchNetwork}
      />
      
      <TransactionConfirmationDialog
        open={showTransactionDialog}
        onOpenChange={setShowTransactionDialog}
        transactionDetails={transactionDetails}
        transactionHash={transactionHash}
        isTransactionConfirmed={isTransactionConfirmed}
        isPurchasing={isPurchasing}
        hasAgreedToTPA={hasAgreedToTPA}
        onConfirmTransaction={handleConfirmTransaction}
        onClose={handleCloseTransactionDialog}
        onShowTPA={() => setShowTPADialog(true)}
      />
      
      <TokenPurchaseAgreementDialog
        open={showTPADialog}
        onOpenChange={setShowTPADialog}
        onAgree={handleAgreeToTPA}
      />
      
      {/* Mobile Approval Banner */}
      <MobileApprovalBanner
        isVisible={showMobileApprovalBanner}
        onClose={() => setShowMobileApprovalBanner(false)}
      />
    </>
  )
}

export default TokenPurchaseNew
