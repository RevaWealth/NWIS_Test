import { Button } from "@/component/UI/button"
import { LoadingSpinner } from "@/component/loading-spinner"
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
  isCorrectNetwork
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
    console.log('Button clicked:', {
      needsApproval,
      currency
    })
    if (needsApproval) {
      onApprove()
    } else {
      onPurchase()
    }
  }

  const isDisabled = !amount || !saleActive || isPurchasing || localIsApproving || isApprovalPending || !isCorrectNetwork

  // Debug logging for production issues
  console.log('PurchaseButton state:', {
    amount: !!amount,
    saleActive,
    isPurchasing,
    localIsApproving,
    isApprovalPending,
    needsApproval,
    simulationData: !!simulationData,
    isCorrectNetwork,
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
        "Switch to Sepolia"
      ) : needsApproval ? (
        `Approve ${currency}`
      ) : (
        "Review Transaction"
      )}
    </Button>
  )
}
