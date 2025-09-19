import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useToast } from '@/hooks/use-toast'
import { PRESALE_CONTRACT_ADDRESS, PRESALE_ABI } from '@/lib/constants'
import { getTokenAddress, convertToSmallestUnits, isMobileDevice } from '@/lib/token-purchase-utils'
import { Currency, TransactionDetails } from '@/lib/types'

interface UseTransactionConfirmationProps {
  currency: Currency
  amount: string
  ethPrice: number
  timestamp: bigint
  contractData: {
    saleActive: boolean
  }
  tokenAmount: string
  onShowMobileBanner?: () => void
}

export const useTransactionConfirmation = ({
  currency,
  amount,
  ethPrice,
  timestamp,
  contractData,
  tokenAmount,
  onShowMobileBanner
}: UseTransactionConfirmationProps) => {
  const { toast } = useToast()
  
  // State management
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [isTransactionConfirmed, setIsTransactionConfirmed] = useState(false)
  const [showTransactionDialog, setShowTransactionDialog] = useState(false)
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null)

  // Convert amount to smallest units
  const amountInSmallestUnits = convertToSmallestUnits(amount, currency)

  // Write contract hook for purchases
  const {
    data: purchaseHash,
    writeContract: writePurchaseContract,
    isPending: isPurchasePending,
    isSuccess: isPurchaseSuccess,
    isError: isPurchaseError,
    error: purchaseError,
  } = useWriteContract()

  // Wait for transaction confirmation
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isConfirmationError,
    error: confirmationError,
  } = useWaitForTransactionReceipt({
    hash: purchaseHash,
    query: { enabled: !!purchaseHash },
  })

  const isPurchasing = isPurchasePending || isConfirming

  // Monitor transaction hash
  useEffect(() => {
    if (purchaseHash && !transactionHash) {
      setTransactionHash(purchaseHash)
      console.log('Transaction submitted:', purchaseHash)
    }
  }, [purchaseHash, transactionHash])

  // Monitor transaction confirmation
  useEffect(() => {
    if (transactionHash && isConfirming) {
      console.log('Transaction confirming:', transactionHash)
    } else if (transactionHash && !isConfirming && !isPurchasePending) {
      setIsTransactionConfirmed(true)
      console.log('Transaction confirmed:', transactionHash)
    }
  }, [transactionHash, isConfirming, isPurchasePending])

  // Handle purchase success
  useEffect(() => {
    if (isPurchaseSuccess) {
      // Toast notification disabled as requested
      // toast({
      //   title: "Transaction Sent",
      //   description: `Transaction sent! Waiting for confirmation... Hash: ${purchaseHash?.slice(0, 6)}...`,
      // })
    }
    if (isPurchaseError) {
      toast({
        title: "Purchase Failed",
        description: purchaseError?.message || "An unknown error occurred during purchase.",
        variant: "destructive",
      })
    }
  }, [isPurchaseSuccess, isPurchaseError, purchaseError, purchaseHash, toast])

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      // Toast notification disabled as requested
      // toast({
      //   title: "Purchase Confirmed",
      //   description: `Your purchase of ${tokenAmount} NWIS tokens is confirmed!`,
      // })
      
      console.log('Purchase confirmed - reset all states and refreshed data')
    }
    if (isConfirmationError) {
      toast({
        title: "Transaction Failed",
        description: confirmationError?.message || "Transaction confirmation failed.",
        variant: "destructive",
      })
    }
  }, [isConfirmed, isConfirmationError, confirmationError, tokenAmount, toast])

  // Handle purchase
  const handlePurchase = async () => {
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

    if (!amountInSmallestUnits) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to purchase.",
        variant: "destructive",
      })
      return
    }

    // Calculate transaction details for confirmation dialog
    const gasEstimate = "0.001" // Default gas estimate
    const nwisAmount = tokenAmount || "0"
    
    setTransactionDetails({
      amountPaid: amount,
      gasEstimate: gasEstimate,
      nwisAmount: nwisAmount,
      contractAddress: PRESALE_CONTRACT_ADDRESS,
      buyerAddress: "", // Will be set by parent component
      currency: currency
    })
    
    setShowTransactionDialog(true)
  }

  // Confirm transaction
  const handleConfirmTransaction = async () => {
    if (!amountInSmallestUnits) return

    // Show mobile banner if on mobile device when Buy NWIS button is pressed
    if (isMobileDevice() && onShowMobileBanner) {
      onShowMobileBanner()
    }

    try {
      if (currency === "ETH") {
        writePurchaseContract({
          address: PRESALE_CONTRACT_ADDRESS,
          abi: PRESALE_ABI,
          functionName: "buyTokenWithEthPrice",
          args: [
            BigInt(Math.floor(ethPrice * 1e6)), // ETH price in smallest units (6 decimals)
            timestamp, // Current timestamp
            "0x" // Empty signature for now (backend verification disabled)
          ],
          value: amountInSmallestUnits,
        })
      } else {
        writePurchaseContract({
          address: PRESALE_CONTRACT_ADDRESS,
          abi: PRESALE_ABI,
          functionName: "buyToken",
          args: [getTokenAddress(currency) as `0x${string}`, amountInSmallestUnits],
        })
      }
    } catch (error) {
      console.error("Purchase error:", error)
      toast({
        title: "Purchase Failed",
        description: "Transaction failed. Please try again.",
        variant: "destructive",
      })
      setShowTransactionDialog(false)
    }
  }

  // Close transaction dialog
  const handleCloseTransactionDialog = () => {
    console.log('Close button clicked - starting dialog close process')
    setShowTransactionDialog(false)
    setTransactionHash(null)
    setIsTransactionConfirmed(false)
    setTransactionDetails(null)
    console.log('About to refresh page...')
    window.location.reload()
  }

  return {
    transactionHash,
    isTransactionConfirmed,
    showTransactionDialog,
    transactionDetails,
    isPurchasing,
    isConfirmed,
    handlePurchase,
    handleConfirmTransaction,
    handleCloseTransactionDialog,
    setShowTransactionDialog,
    setTransactionDetails
  }
}
