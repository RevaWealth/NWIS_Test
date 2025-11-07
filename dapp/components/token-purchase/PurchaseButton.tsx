import { Button } from "@/components/UI/button"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ConnectKitButton } from "connectkit"

interface PurchaseButtonProps {
  isConnected: boolean
  onConnect: () => void
  onPurchase: () => void
  onApprove: () => void
  needsApproval: boolean
  currency: string
  amount: string
  saleActive: boolean
  isPurchasing: boolean
  localIsApproving: boolean
  isApprovalPending: boolean
  simulationData: any
  isCorrectNetwork: boolean
  hasInsufficientBalance: boolean
  onShowNetworkDialog?: () => void
}

export const PurchaseButton = ({
  isConnected,
  onConnect,
  onPurchase,
  onApprove,
  needsApproval,
  currency,
  amount,
  saleActive,
  isPurchasing,
  localIsApproving,
  isApprovalPending,
  simulationData,
  isCorrectNetwork,
  hasInsufficientBalance,
  onShowNetworkDialog
}: PurchaseButtonProps) => {
  if (!isConnected) {
    return (
      <Button
        onClick={onConnect}
        className="w-full text-white font-medium py-3"
        style={{ backgroundColor: '#a57e24' }}
      >
        Connect Wallet
      </Button>
    )
  }

  const handleClick = () => {
    // Prevent action if balance is insufficient
    if (hasInsufficientBalance) {
      return
    }
    
    // Check network before proceeding - show dialog if network is wrong
    if (!isCorrectNetwork) {
      // Show network dialog if callback is provided
      if (onShowNetworkDialog) {
        onShowNetworkDialog()
      }
      // Still call the handlers - they will also check and show dialog
      if (needsApproval) {
        onApprove()
      } else {
        onPurchase()
      }
      return
    }
    
    console.log('Button clicked:', {
      needsApproval,
      currency,
      isCorrectNetwork
    })
    if (needsApproval) {
      onApprove()
    } else {
      onPurchase()
    }
  }

  const isDisabled = !amount || !saleActive || isPurchasing || localIsApproving || isApprovalPending || !isCorrectNetwork || hasInsufficientBalance

  // Debug logging for production issues
  console.log('PurchaseButton state:', {
    amount: !!amount,
    amountValue: amount,
    saleActive,
    isPurchasing,
    localIsApproving,
    isApprovalPending,
    needsApproval,
    simulationData: !!simulationData,
    isCorrectNetwork,
    hasInsufficientBalance,
    isDisabled,
    currency
  })

  return (
    <Button
      onClick={handleClick}
      disabled={isDisabled}
      className="w-full text-white font-medium py-3"
      style={{ backgroundColor: '#a57e24' }}
      title={`Debug: amount=${!!amount}, saleActive=${saleActive}, isPurchasing=${isPurchasing}, needsApproval=${needsApproval}, simulationData=${!!simulationData}, isCorrectNetwork=${isCorrectNetwork}`}
    >
      {(localIsApproving || isApprovalPending || (isPurchasing && !needsApproval)) ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          {isApprovalPending ? "Processing..." : localIsApproving ? "Approving..." : (isPurchasing ? "Sending..." : "Processing...")}
        </div>
      ) : !isCorrectNetwork ? (
        "Switch to Ethereum"
      ) : hasInsufficientBalance ? (
        "Insufficient Balance"
      ) : needsApproval ? (
        `Approve ${currency}`
      ) : (
        "Review Transaction"
      )}
    </Button>
  )
}
