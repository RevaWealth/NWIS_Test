import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/component/UI/dialog"
import { Button } from "@/component/UI/button"
import { getNetworkName, isMobileDevice } from '@/lib/token-purchase-utils'

interface NetworkSwitchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chainId: number | undefined
  onSwitchNetwork: () => void
}

export const NetworkSwitchDialog = ({ 
  open, 
  onOpenChange, 
  chainId, 
  onSwitchNetwork 
}: NetworkSwitchDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Wrong Network</DialogTitle>
          <DialogDescription className="text-gray-300">
            Your wallet is connected to the wrong network. Please switch to Sepolia Testnet to continue with the token purchase.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-300">Current Network: {getNetworkName(chainId)}</span>
            </div>
            <div className="flex items-center space-x-3 mt-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-300">Required Network: Sepolia Testnet</span>
            </div>
          </div>
          
          {/* Mobile-specific instructions */}
          {isMobileDevice() && (
            <div className="p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg">
              <h4 className="text-sm font-semibold text-yellow-400 mb-2">📱 Mobile Wallet Instructions:</h4>
              <div className="text-xs text-yellow-200 space-y-1">
                <p>• Open your wallet app (MetaMask, Trust Wallet, etc.)</p>
                <p>• Go to Settings → Networks or Network Settings</p>
                <p>• Add or select "Sepolia Testnet"</p>
                <p>• Return to this page and refresh</p>
              </div>
            </div>
          )}
          
          <div className="flex space-x-3">
            <Button
              onClick={onSwitchNetwork}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Switch to Sepolia
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
