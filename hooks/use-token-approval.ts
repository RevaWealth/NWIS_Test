import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { useToast } from '@/hooks/use-toast'
import { PRESALE_CONTRACT_ADDRESS, ERC20_ABI } from '@/lib/constants'
import { getTokenAddress, convertToSmallestUnits } from '@/lib/token-purchase-utils'
import { Currency } from '@/lib/types'

export const useTokenApproval = (currency: Currency, amount: string) => {
  const { address } = useAccount()
  const { toast } = useToast()
  
  // State management
  const [tokenAllowance, setTokenAllowance] = useState<bigint>(BigInt(0))
  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [approvalCompleted, setApprovalCompleted] = useState(false)
  const [localIsApproving, setLocalIsApproving] = useState(false)

  // Convert amount to smallest units
  const amountInSmallestUnits = useMemo(() => {
    if (!amount) return undefined
    return convertToSmallestUnits(amount, currency)
  }, [amount, currency])

  // Read token allowance from blockchain
  const { data: allowanceData, refetch: refetchAllowance, isLoading: isAllowanceLoading, error: allowanceError } = useReadContract({
    address: currency !== "ETH" ? getTokenAddress(currency) as `0x${string}` : undefined,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, PRESALE_CONTRACT_ADDRESS] : undefined,
    query: {
      enabled: currency !== "ETH" && !!address,
      refetchInterval: 2000,
      refetchIntervalInBackground: true,
    }
  })

  // Write contract hooks for approval
  const {
    data: approveHash,
    writeContract: writeApproveContract,
    isPending: isApprovePending,
    isSuccess: isApproveSuccess,
    isError: isApproveError,
    error: approveError,
  } = useWriteContract()

  // Wait for approval transaction confirmation
  const {
    isLoading: isApprovalConfirming,
    isSuccess: isApprovalConfirmed,
    isError: isApprovalConfirmationError,
    error: approvalConfirmationError,
  } = useWaitForTransactionReceipt({
    hash: approveHash,
    query: { enabled: !!approveHash },
  })

  // Combined approval pending state
  const isApprovalPending = isApprovePending || isApprovalConfirming

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
      
      if (allowanceData >= amountInSmallestUnits) {
        console.log('Blockchain allowance sufficient for current amount')
      } else {
        console.log('Blockchain allowance insufficient, approval needed')
      }
    } else if (allowanceError) {
      console.log('Allowance error:', allowanceError.message)
    }
  }, [allowanceData, amountInSmallestUnits, currency, isAllowanceLoading, allowanceError])

  // Force allowance check when currency changes
  useEffect(() => {
    if (currency !== "ETH" && address && amountInSmallestUnits) {
      console.log('Forcing allowance check on mount/currency change')
      setTimeout(() => {
        refetchAllowance()
      }, 500)
    }
  }, [currency, address, amountInSmallestUnits, refetchAllowance])

  // Reset approval completed flag when amount changes beyond current allowance
  useEffect(() => {
    if (amountInSmallestUnits && approvalCompleted) {
      // Check if the new amount exceeds the current allowance
      const currentAllowance = allowanceData || tokenAllowance
      if (currentAllowance > BigInt(0) && amountInSmallestUnits > currentAllowance) {
        console.log('Amount exceeds current allowance, resetting approval completed flag')
        setApprovalCompleted(false)
      }
    }
  }, [amountInSmallestUnits, approvalCompleted, allowanceData, tokenAllowance])

  // Handle approval errors
  useEffect(() => {
    if (isApproveError && approveError) {
      console.log('Approval error detected:', approveError)
      setIsApproving(false)
      setLocalIsApproving(false)
    }
  }, [isApproveError, approveError])

  // Handle approval confirmation errors
  useEffect(() => {
    if (isApprovalConfirmationError && approvalConfirmationError) {
      console.log('Approval confirmation error detected:', approvalConfirmationError)
      setIsApproving(false)
      setLocalIsApproving(false)
      
      toast({
        title: "Approval Failed",
        description: "Approval transaction failed. Please try again.",
        variant: "destructive",
      })
    }
  }, [isApprovalConfirmationError, approvalConfirmationError, toast])

  // Safety timeout to reset approval state
  useEffect(() => {
    if (localIsApproving || isApproving) {
      const timeout = setTimeout(() => {
        console.log('Approval timeout - resetting states')
        setIsApproving(false)
        setLocalIsApproving(false)
        
        toast({
          title: "Approval Timeout",
          description: "Approval request timed out. Please try again.",
          variant: "destructive",
        })
      }, 30000)

      return () => clearTimeout(timeout)
    }
  }, [localIsApproving, isApproving, toast])

  // Check token allowance
  const checkTokenAllowance = useCallback(async () => {
    if (currency === "ETH" || !amountInSmallestUnits || !address) return
    
    setIsCheckingAllowance(true)
    try {
      await refetchAllowance()
    } catch (error) {
      console.error('Error checking token allowance:', error)
      setTokenAllowance(BigInt(0))
    } finally {
      setIsCheckingAllowance(false)
    }
  }, [currency, amountInSmallestUnits, address, refetchAllowance])

  // Handle approval success
  useEffect(() => {
    console.log('Approval success handler triggered:', {
      isApprovalConfirmed,
      approveHash,
      amountInSmallestUnits: amountInSmallestUnits?.toString()
    })
    
    if (isApprovalConfirmed && approveHash) {
      console.log('Processing approval success...')
      
      toast({
        title: "Approval Success",
        description: "Tokens approved! You can now purchase.",
      })
      
      // Reset all approval states
      setIsApproving(false)
      setLocalIsApproving(false)
      
      // Set approval completed flag to bypass blockchain checks temporarily
      setApprovalCompleted(true)
      
      // Immediately refresh allowance from blockchain
      refetchAllowance()
      
      // Force a manual allowance check to update local state
      setTimeout(() => {
        console.log('Forcing manual allowance check...')
        checkTokenAllowance()
        refetchAllowance()
      }, 1000)
      
      // Additional refresh after a short delay to ensure blockchain state is updated
      const refreshTimer = setTimeout(() => {
        console.log('Refreshing allowance again after delay...')
        refetchAllowance()
        checkTokenAllowance()
        refetchAllowance()
      }, 3000)
      
      // Final refresh to ensure everything is synced
      const aggressiveRefreshTimer = setTimeout(() => {
        console.log('Aggressive allowance refresh...')
        refetchAllowance()
        checkTokenAllowance()
      }, 5000)
      
      return () => {
        clearTimeout(refreshTimer)
        clearTimeout(aggressiveRefreshTimer)
      }
    }
  }, [isApprovalConfirmed, approveHash, amountInSmallestUnits, toast, refetchAllowance, checkTokenAllowance])

  // Approve tokens
  const approveTokens = useCallback(async () => {
    if (currency === "ETH" || !amountInSmallestUnits) return
    
    setIsApproving(true)
    setLocalIsApproving(true)
    
    try {
      const tokenAddress = getTokenAddress(currency)
      
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
      setLocalIsApproving(false)
    }
  }, [currency, amountInSmallestUnits, writeApproveContract, toast])

  // Check if approval is needed
  const needsApproval = useMemo(() => {
    if (currency === "ETH") return false
    if (!amountInSmallestUnits) return false
    
    // If approval was just completed, don't require approval anymore
    if (approvalCompleted) {
      console.log('needsApproval calculation (approval completed):', {
        currency,
        amountInSmallestUnits: amountInSmallestUnits?.toString(),
        approvalCompleted,
        result: false
      })
      return false
    }
    
    if (!allowanceData) {
      const cachedAllowance = tokenAllowance
      if (cachedAllowance > BigInt(0)) {
        const result = cachedAllowance < amountInSmallestUnits || isApprovalPending
        console.log('needsApproval calculation (using cached):', {
          currency,
          amountInSmallestUnits: amountInSmallestUnits?.toString(),
          cachedAllowance: cachedAllowance.toString(),
          isApprovalPending,
          allowanceSufficient: cachedAllowance >= amountInSmallestUnits,
          result
        })
        return result
      }
      return true
    }
    
    const effectiveIsApprovalPending = isApprovalPending
    const result = allowanceData < amountInSmallestUnits || effectiveIsApprovalPending
    console.log('needsApproval calculation (using blockchain):', {
      currency,
      amountInSmallestUnits: amountInSmallestUnits?.toString(),
      blockchainAllowance: allowanceData?.toString(),
      isApprovalPending,
      approvalCompleted,
      effectiveIsApprovalPending,
      allowanceSufficient: allowanceData >= amountInSmallestUnits,
      result
    })
    
    return result
  }, [currency, amountInSmallestUnits, allowanceData, tokenAllowance, isApprovalPending, approvalCompleted])

  return {
    tokenAllowance,
    isCheckingAllowance,
    isApproving,
    isApprovalPending,
    localIsApproving,
    needsApproval,
    checkTokenAllowance,
    approveTokens,
    refetchAllowance
  }
}
