import { Input } from "@/component/UI/input"
import { Currency } from "@/lib/types"

interface AmountInputProps {
  amount: string
  currency: Currency
  onAmountChange: (amount: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onBlur: () => void
  saleActive: boolean
  isPurchasing: boolean
  debouncedAmount: string
}

export const AmountInput = ({
  amount,
  currency,
  onAmountChange,
  onKeyDown,
  onBlur,
  saleActive,
  isPurchasing,
  debouncedAmount
}: AmountInputProps) => {
  return (
    <div className="mb-4">
      <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
        Amount to Purchase
      </label>
      <div className="relative">
        <Input
          id="amount"
          type="text"
          placeholder="0.00"
          value={amount}
          onChange={(e) => {
            // Only allow numbers and decimal points
            const value = e.target.value
            if (value === "" || /^\d*\.?\d*$/.test(value)) {
              onAmountChange(value)
            }
          }}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          className="w-full bg-gray-800 border-gray-600 text-white placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          disabled={!saleActive || isPurchasing}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
          {currency}
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        <span>Enter any amount to purchase NWIS tokens</span>
      </div>
      <div className="text-xs text-gray-400 mt-1">
        💡 Type your amount - press Enter or click outside to calculate NWIS tokens
      </div>
      {amount !== debouncedAmount && (
        <div className="text-xs text-blue-400 mt-1">
          ⏳ Ready to calculate - press Enter or click outside
        </div>
      )}
    </div>
  )
}
