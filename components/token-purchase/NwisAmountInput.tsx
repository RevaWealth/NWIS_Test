import { Input } from "@/component/UI/input"

interface NwisAmountInputProps {
  nwisTokenAmount: string
  onNwisAmountChange: (amount: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onBlur: () => void
  saleActive: boolean
  isPurchasing: boolean
  debouncedNwisTokenAmount: string
  isPayAmountLoading: boolean
  isEthPriceLoading: boolean
  payAmountError: Error | null
  currency: string
  isConnected: boolean
}

export const NwisAmountInput = ({
  nwisTokenAmount,
  onNwisAmountChange,
  onKeyDown,
  onBlur,
  saleActive,
  isPurchasing,
  debouncedNwisTokenAmount,
  isPayAmountLoading,
  isEthPriceLoading,
  payAmountError,
  currency,
  isConnected
}: NwisAmountInputProps) => {
  return (
    <div className="mb-4">
      <label htmlFor="tokenAmount" className="block text-sm font-medium text-gray-300 mb-2">
        NWIS Amount
      </label>
      <div className="relative">
        <Input
          id="tokenAmount"
          type="text"
          placeholder="0"
          value={nwisTokenAmount}
          onChange={(e) => {
            const value = e.target.value
            if (value === "" || /^\d*\.?\d*$/.test(value)) {
              onNwisAmountChange(value)
            }
          }}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          className="w-full bg-gray-800 border-gray-600 text-white placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          disabled={!saleActive || isPurchasing}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
          NWIS
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        <span>Enter NWIS token amount to calculate required payment</span>
      </div>
      {nwisTokenAmount && nwisTokenAmount !== debouncedNwisTokenAmount && (
        <div className="text-xs text-blue-400 mt-1">
          ⏳ Ready to calculate - press Enter or click outside
        </div>
      )}
      {nwisTokenAmount && (isPayAmountLoading || (currency === "ETH" && isEthPriceLoading)) && (
        <div className="text-xs text-blue-400 mt-1">
          ⏳ Calculating required payment...
        </div>
      )}
      {nwisTokenAmount && payAmountError && isConnected && (
        <div className="text-xs text-red-400 mt-1">
          ❌ Error: {payAmountError.message || 'Failed to calculate payment amount'}
        </div>
      )}
    </div>
  )
}
