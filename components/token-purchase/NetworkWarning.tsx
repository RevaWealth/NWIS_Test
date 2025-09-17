import { getNetworkName } from '@/lib/token-purchase-utils'

interface NetworkWarningProps {
  isConnected: boolean
  isCorrectNetwork: boolean
  chainId: number | undefined
}

export const NetworkWarning = ({ isConnected, isCorrectNetwork, chainId }: NetworkWarningProps) => {
  if (!isConnected || isCorrectNetwork) {
    return null
  }

  return (
    <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg mb-3">
      <p className="text-sm text-red-400">
        <strong>⚠️ Wrong Network!</strong> Please switch to Sepolia testnet to purchase tokens.
      </p>
      <p className="text-xs text-red-300 mt-1">
        Current network: {getNetworkName(chainId)} | Required: Sepolia Testnet
      </p>
      {typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && (
        <p className="text-xs text-yellow-300 mt-2">
          📱 <strong>Mobile:</strong> Switch networks in your wallet app settings, then refresh this page.
        </p>
      )}
    </div>
  )
}
