import { ContractData } from '@/lib/types'

interface ProgressBarProps {
  contractData: ContractData
  isLoadingContractData: boolean
}

export const ProgressBar = ({ contractData, isLoadingContractData }: ProgressBarProps) => {
  const calculateTierProgress = () => {
    const currentTierStartAmount = parseFloat(contractData.currentTier.startAmount.toString())
    const currentTierEndAmount = parseFloat(contractData.currentTier.endAmount.toString())
    const currentTierRange = currentTierEndAmount - currentTierStartAmount
    const tokensSoldInCurrentTier = Math.max(0, parseFloat(contractData.totalTokensSold.toString()) - currentTierStartAmount)
    const maxTokensInCurrentTier = Math.min(tokensSoldInCurrentTier, currentTierRange)
    const tierProgress = currentTierRange > 0 ? ((maxTokensInCurrentTier / currentTierRange) * 100) : 0
    return tierProgress.toFixed(2)
  }

  const tierProgress = calculateTierProgress()

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-white">Sale Progress</span>
      </div>
      <div className="relative w-full bg-gray-700 rounded-full h-9 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-violet-500 to-red-700 rounded-full transition-all duration-500 ease-out relative"
          style={{ width: `${isLoadingContractData ? "0" : tierProgress}%` }}
        >
          {/* Sliding pulse effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse-slide rounded-full"></div>
        </div>
        {/* Centered text overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white drop-shadow-lg">
            Current Tier Progress: {isLoadingContractData ? "Loading..." : `${tierProgress}%`}
          </span>
        </div>
      </div>
      <div className="flex justify-between text-sm mt-1">
        <span className="font-bold text-white">
          Current Tier Price: <span className="text-violet-400">
            {isLoadingContractData ? "Loading..." : `$${contractData.currentTier.price.toFixed(4)}`}
          </span>
        </span>
        <span className="font-bold text-white">
          Next Tier Price: <span className="text-red-600">
            {isLoadingContractData ? "Loading..." : `$${contractData.nextTier.price.toFixed(4)}`}
          </span>
        </span>
      </div>
    </div>
  )
}
