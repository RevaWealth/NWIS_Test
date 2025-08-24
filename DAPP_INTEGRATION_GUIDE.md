# 🚀 **NexusWealth PreSale Dapp Integration Guide**

This guide will help you integrate your dapp with the deployed NexusWealth PreSale contract on Sepolia testnet.

## 📋 **Table of Contents**

1. [Prerequisites](#prerequisites)
2. [Files Overview](#files-overview)
3. [Integration Steps](#integration-steps)
4. [Usage Examples](#usage-examples)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

## 🔧 **Prerequisites**

- ✅ **Deployed Contracts** (Already done!)
  - PreSale Contract: `0x478dBa1446951Ae3679C40bc0e6566e24cedB520`
  - NWIS Token: `0xACCeea4CFe324AD2597EE6193642f60917C254f7`
- ✅ **Sepolia Testnet** configured
- ✅ **MetaMask** or compatible wallet
- ✅ **Sepolia ETH** for gas fees

## 📁 **Files Overview**

### **Core Integration Files**

| File | Purpose | Description |
|------|---------|-------------|
| `contract-config.js` | Configuration | Contract addresses, ABIs, and settings |
| `dapp-integration-service.js` | Service Layer | Main service for contract interactions |
| `useNexusWealthPresale.js` | React Hook | Easy React integration |

### **Contract Details**

- **Network**: Sepolia Testnet (Chain ID: 11155111)
- **PreSale Contract**: `0x478dBa1446951Ae3679C40bc0e6566e24cedB520`
- **NWIS Token**: `0xACCeea4CFe324AD2597EE6193642f60917C254f7`
- **Backend Signer**: `0x9c784Eb444866fAa7101221DB14D96Ae6B7fC9a0`

## 🔗 **Integration Steps**

### **Step 1: Copy Integration Files to Your Dapp**

Copy these files to your `NexusWealthVGit` project:

```bash
# From your current project directory
cp contract-config.js /path/to/NexusWealthVGit/
cp dapp-integration-service.js /path/to/NexusWealthVGit/
cp useNexusWealthPresale.js /path/to/NexusWealthVGit/
```

### **Step 2: Install Dependencies**

In your dapp directory, install required packages:

```bash
npm install ethers@5.7.2
# or
yarn add ethers@5.7.2
```

**Note**: Use ethers v5 for compatibility with the current implementation.

### **Step 3: Import and Use in Your Components**

```javascript
import React, { useState } from 'react';
import { useNexusWealthPresale } from './useNexusWealthPresale';

function PresaleComponent() {
    const {
        connectWallet,
        disconnectWallet,
        connectionStatus,
        presaleStatus,
        userInfo,
        previewPurchase,
        executePurchase,
        loading,
        error
    } = useNexusWealthPresale();

    const [ethAmount, setEthAmount] = useState('0.1');

    const handleConnect = async () => {
        await connectWallet();
    };

    const handlePurchase = async () => {
        try {
            // Preview first
            const preview = await previewPurchase(parseFloat(ethAmount));
            console.log('Preview:', preview);
            
            // Execute purchase
            const result = await executePurchase(parseFloat(ethAmount));
            console.log('Purchase result:', result);
        } catch (err) {
            console.error('Purchase failed:', err);
        }
    };

    return (
        <div>
            <h2>NexusWealth PreSale</h2>
            
            {!connectionStatus.isConnected ? (
                <button onClick={handleConnect} disabled={loading}>
                    {loading ? 'Connecting...' : 'Connect Wallet'}
                </button>
            ) : (
                <div>
                    <p>Connected: {connectionStatus.account}</p>
                    <p>Network: {connectionStatus.network?.name}</p>
                    
                    <div>
                        <h3>Presale Status</h3>
                        <p>Active: {presaleStatus.isActive ? 'Yes' : 'No'}</p>
                        <p>Progress: {presaleStatus.progress}%</p>
                        <p>Remaining: {presaleStatus.remainingTokens} NWIS</p>
                    </div>
                    
                    <div>
                        <h3>Your Info</h3>
                        <p>NWIS Balance: {userInfo.nwisBalance}</p>
                        <p>Total Purchased: {userInfo.totalPurchased}</p>
                    </div>
                    
                    <div>
                        <h3>Purchase Tokens</h3>
                        <input
                            type="number"
                            value={ethAmount}
                            onChange={(e) => setEthAmount(e.target.value)}
                            placeholder="ETH amount"
                            step="0.01"
                            min="0.01"
                        />
                        <button onClick={handlePurchase} disabled={loading}>
                            {loading ? 'Processing...' : 'Buy Tokens'}
                        </button>
                    </div>
                    
                    <button onClick={disconnectWallet}>Disconnect</button>
                </div>
            )}
            
            {error && <p style={{color: 'red'}}>Error: {error}</p>}
        </div>
    );
}

export default PresaleComponent;
```

## 🎯 **Usage Examples**

### **Basic Wallet Connection**

```javascript
import { useNexusWealthPresale } from './useNexusWealthPresale';

function App() {
    const { connectWallet, connectionStatus } = useNexusWealthPresale();

    useEffect(() => {
        // Auto-connect if wallet was previously connected
        if (window.ethereum && window.ethereum.selectedAddress) {
            connectWallet();
        }
    }, []);

    return (
        <div>
            {!connectionStatus.isConnected ? (
                <button onClick={connectWallet}>Connect Wallet</button>
            ) : (
                <p>Connected: {connectionStatus.account}</p>
            )}
        </div>
    );
}
```

### **Purchase Flow**

```javascript
const handlePurchase = async (ethAmount) => {
    try {
        // 1. Preview purchase
        const preview = await previewPurchase(ethAmount);
        console.log(`You'll receive ${preview.tokensToReceive} NWIS tokens`);
        
        // 2. Execute purchase
        const result = await executePurchase(ethAmount);
        if (result.success) {
            alert(`Purchase successful! TX: ${result.transactionHash}`);
        }
    } catch (error) {
        alert(`Purchase failed: ${error.message}`);
    }
};
```

### **Real-time Updates**

```javascript
useEffect(() => {
    if (connectionStatus.isConnected) {
        // Data auto-refreshes every 30 seconds
        // You can also manually refresh:
        refreshAllData();
    }
}, [connectionStatus.isConnected]);
```

## 🧪 **Testing**

### **Test Purchase Flow**

1. **Connect Wallet** to Sepolia testnet
2. **Check Balance** - ensure you have Sepolia ETH
3. **Preview Purchase** - test with small amounts (0.01 ETH)
4. **Execute Purchase** - confirm transaction in wallet
5. **Verify Results** - check token balance and transaction

### **Test Scenarios**

- ✅ **Valid Purchase**: 0.01 ETH → Should receive NWIS tokens
- ✅ **Invalid Amount**: 0.001 ETH → Should show error (below minimum)
- ✅ **Network Switch**: Change to mainnet → Should prompt for Sepolia
- ✅ **Account Switch**: Change MetaMask account → Should update data

## 🔍 **Troubleshooting**

### **Common Issues**

| Issue | Solution |
|-------|----------|
| **"MetaMask not found"** | Install MetaMask extension |
| **"Wrong network"** | Switch to Sepolia testnet |
| **"Insufficient balance"** | Get Sepolia ETH from faucet |
| **"Contract not found"** | Verify contract addresses |
| **"Gas estimation failed"** | Check contract state and parameters |

### **Debug Commands**

```javascript
// Check connection status
console.log(connectionStatus);

// Check contract instances
console.log(presaleContract);
console.log(nwisTokenContract);

// Test basic contract calls
const status = await presaleContract.saleStatus();
console.log('Sale active:', status);
```

### **Network Configuration**

If Sepolia is not available in MetaMask:

```javascript
// Add Sepolia network
const sepoliaNetwork = {
    chainId: "0xaa36a7",
    chainName: "Sepolia testnet",
    nativeCurrency: {
        name: "Sepolia Ether",
        symbol: "SEP",
        decimals: 18
    },
    rpcUrls: ["https://eth-sepolia.g.alchemy.com/v2/iw39nauos-kYHDLTagkEj"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"]
};

await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [sepoliaNetwork]
});
```

## 📱 **Mobile Support**

For mobile dapps, consider using:

- **WalletConnect** for mobile wallet connections
- **Web3Modal** for multiple wallet support
- **Responsive design** for mobile interfaces

## 🚀 **Next Steps**

1. **Test Integration** with small purchases
2. **Customize UI** to match your design
3. **Add Error Handling** for better user experience
4. **Implement Analytics** to track user behavior
5. **Prepare for Mainnet** deployment

## 📞 **Support**

If you encounter issues:

1. Check the browser console for error messages
2. Verify contract addresses are correct
3. Ensure you're on Sepolia testnet
4. Check that contracts are properly deployed
5. Verify backend signature verification is working

---

**🎉 Your dapp is now ready to connect to the NexusWealth PreSale contract!**
