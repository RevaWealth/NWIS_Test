"use client"

import { useState } from "react"

export default function TokenPurchaseNewSimple() {
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("ETH")

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-4">Token Purchase (Simplified)</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Currency
        </label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
        >
          <option value="ETH">ETH</option>
          <option value="USDT">USDT</option>
          <option value="USDC">USDC</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Amount
        </label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
        />
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
        Connect Wallet to Purchase
      </button>

      <div className="mt-4 p-3 bg-gray-700 rounded text-sm text-gray-300">
        <p>This is a simplified test version.</p>
        <p>Currency: {currency}</p>
        <p>Amount: {amount || "Not set"}</p>
      </div>
    </div>
  )
}

