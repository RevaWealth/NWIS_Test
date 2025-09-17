import { Button } from "@/component/UI/button"
import { LoadingSpinner } from "@/component/loading-spinner"
import { currencyConfig } from "@/lib/currency-config"
import { Currency } from "@/lib/types"

interface CurrencySelectorProps {
  currency: Currency
  onCurrencyChange: (currency: Currency) => void
  isSimulating: boolean
  saleActive: boolean
}

export const CurrencySelector = ({ 
  currency, 
  onCurrencyChange, 
  isSimulating, 
  saleActive 
}: CurrencySelectorProps) => {
  return (
    <div className="mb-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(currencyConfig).map(([curr, { icon: Icon, color }]) => {
          let buttonClasses = ""
          if (curr === "USDT") {
            buttonClasses = "bg-green-600 hover:bg-green-700 text-white"
          } else if (curr === "USDC") {
            buttonClasses = "bg-blue-600 hover:bg-blue-700 text-white"
          } else if (curr === "ETH") {
            buttonClasses = "bg-gray-600 hover:bg-gray-700 text-white"
          } else {
            buttonClasses = "bg-purple-600 hover:bg-purple-700 text-white"
          }

          const isSelected = currency === curr
          const borderClass = isSelected ? "border-2 border-white" : "border-2 border-gray-600"

          return (
            <Button
              key={curr}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onCurrencyChange(curr as Currency)}
              disabled={isSimulating || !saleActive}
              className={`${buttonClasses} ${borderClass} flex items-center justify-center gap-2 text-sm py-2 px-4 min-w-[100px] h-10`}
            >
              {isSimulating && currency === curr ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Icon className={`h-4 w-4 ${isSelected ? "text-white" : color}`} />
                  {curr}
                </>
              )}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
