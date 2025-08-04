import { LoadingSpinner } from "./loading-spinner"

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          LightChain
        </div>
        <LoadingSpinner size="lg" className="mx-auto text-purple-500" />
        <p className="text-gray-400 text-sm">Loading your experience...</p>
      </div>
    </div>
  )
}
