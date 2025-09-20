import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/component/UI/dialog"
import { Button } from "@/component/UI/button"
import { LoadingSpinner } from "@/component/loading-spinner"
import { TransactionDetails } from "@/lib/types"
import { getDialogConfig, isWalletBrowser } from "@/lib/wallet-browser-utils"

interface TransactionConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transactionDetails: TransactionDetails | null
  transactionHash: string | null
  isTransactionConfirmed: boolean
  isPurchasing: boolean
  hasAgreedToTPA: boolean
  onConfirmTransaction: () => void
  onClose: () => void
  onShowTPA: () => void
}

export const TransactionConfirmationDialog = ({
  open,
  onOpenChange,
  transactionDetails,
  transactionHash,
  isTransactionConfirmed,
  isPurchasing,
  hasAgreedToTPA,
  onConfirmTransaction,
  onClose,
  onShowTPA
}: TransactionConfirmationDialogProps) => {
  const isWallet = isWalletBrowser()
  const dialogConfig = getDialogConfig()
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`${isWallet ? 'max-w-[95vw]' : 'sm:max-w-lg'} border-2 border-sky-950 rounded-xl bg-sky-950`}
        style={{
          zIndex: dialogConfig.zIndex,
          maxWidth: isWallet ? '95vw' : undefined,
          margin: dialogConfig.margin,
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {isTransactionConfirmed ? "Transaction Confirmed!" : transactionHash ? "Processing Transaction..." : "Confirm Transaction"}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {isTransactionConfirmed 
              ? "Your transaction has been successfully confirmed on the blockchain."
              : transactionHash 
                ? "Your transaction is being processed. Please wait for confirmation."
                : "Please review the transaction details and the Token Purchase Agreement before confirming your purchase."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {transactionDetails && (
            <>
              {/* Transaction Summary */}
              <div className="p-4 bg-gray-800 rounded-xl border border-gray-600">
                <h4 className="text-lg font-semibold text-white mb-3">Transaction Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Amount to Pay:</span>
                    <span className="text-white font-medium">{transactionDetails.amountPaid} {transactionDetails.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">NWIS Tokens to Receive:</span>
                    <span className="text-white font-medium">
                      {(() => {
                        const num = Number(transactionDetails.nwisAmount.replace(/,/g, ''))
                        return isNaN(num) ? "0" : num.toLocaleString()
                      })()} NWIS
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Estimated Gas Fee:</span>
                    <span className="text-white font-medium">~{transactionDetails.gasEstimate} ETH</span>
                  </div>
                </div>
              </div>

              {/* Token Purchase Agreement */}
              <div className={`${isWallet ? 'p-3' : 'p-4'} bg-gray-800 rounded-xl border-2 transition-colors duration-300 ${hasAgreedToTPA ? 'border-green-500' : 'border-red-500'}`}>
                <h4 className={`${isWallet ? 'text-base' : 'text-lg'} font-semibold text-white mb-3 text-center`}>Token Purchase Agreement</h4>
                <div className="text-center">
                  <button
                    onClick={onShowTPA}
                    className={`inline-flex items-center justify-center ${isWallet ? 'px-3 py-2 text-xs' : 'px-4 py-2 text-sm'} bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-xl transition-colors duration-200`}
                  >
                    {isWallet ? 'View TPA' : 'View Token Purchase Agreement'}
                  </button>
                  {hasAgreedToTPA && (
                    <div className="mt-2 flex items-center justify-center space-x-2 text-green-400">
                      <span className="text-sm">✓</span>
                      <span className="text-sm font-medium">Agreed to Terms</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Warning - only show before confirmation */}
              {!transactionHash && (
                <div className="p-3 bg-yellow-900/20 border border-yellow-600 rounded-xl">
                  <div className="flex items-start space-x-2">
                    <div className="text-yellow-400 text-sm">⚠️</div>
                    <div className="text-yellow-200 text-sm">
                      <strong>Important:</strong> This transaction cannot be undone. Please ensure all details are correct before confirming.
                    </div>
                  </div>
                </div>
              )}

              {/* Transaction Hash - show after submission */}
              {transactionHash && (
                <div className={`${isWallet ? 'p-3' : 'p-4'} bg-blue-900/20 border border-blue-600 rounded-xl`}>
                  <h4 className={`${isWallet ? 'text-base' : 'text-lg'} font-semibold text-white mb-3`}>Transaction Details</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-300 text-sm">Transaction Hash:</span>
                      <div className="text-white font-mono text-sm break-all mt-1">
                        {transactionHash}
                      </div>
                    </div>
                    <div className="pt-2">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View on Etherscan
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Action Buttons */}
          <div className={`flex ${isWallet ? 'flex-col space-y-2' : 'space-x-3'}`}>
            {!isTransactionConfirmed ? (
              <>
                <Button
                  onClick={onConfirmTransaction}
                  className="flex-1 text-white rounded-xl"
                  style={{ backgroundColor: hasAgreedToTPA ? '#a57e24' : '#6b7280' }}
                  disabled={isPurchasing || !!transactionHash || !hasAgreedToTPA}
                >
                  {isPurchasing ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      {transactionHash ? "Confirming..." : "Processing..."}
                    </div>
                  ) : (
                    "Buy NWIS"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 rounded-xl"
                  disabled={isPurchasing || !!transactionHash}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                Close
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
