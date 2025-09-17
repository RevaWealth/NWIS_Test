import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/component/UI/dialog"
import { Button } from "@/component/UI/button"
import { useState } from "react"

interface TokenPurchaseAgreementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAgree: () => void
}

export const TokenPurchaseAgreementDialog = ({ 
  open, 
  onOpenChange, 
  onAgree 
}: TokenPurchaseAgreementDialogProps) => {
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-sky-950 border-sky-800">
        <DialogTitle className="text-xl font-bold text-white mb-4">
          Token Purchase Agreement
        </DialogTitle>
        <DialogDescription className="text-gray-300 mb-4">
          Please review the Token Purchase Agreement carefully before proceeding.
        </DialogDescription>
        
        <div className="flex-1 bg-white rounded-lg overflow-hidden mb-4">
          <div className="h-[60vh] overflow-auto" onScroll={(e) => {
            const target = e.target as HTMLDivElement
            const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 10
            setIsScrolledToBottom(isAtBottom)
          }}>
            <iframe
              src="/TPA.pdf#view=FitH&scrollbar=1&toolbar=0&navpanes=0"
              className="w-full h-full"
              title="Token Purchase Agreement"
              style={{ border: 'none', minHeight: '800px' }}
            />
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button
            onClick={handleClose}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Close
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onAgree()
              onOpenChange(false)
            }}
            disabled={!isScrolledToBottom}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Agree
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
