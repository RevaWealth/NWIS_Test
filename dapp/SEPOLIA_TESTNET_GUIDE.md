# 🧪 Sepolia Testnet Configuration Guide

## ✅ Configuration Complete

Your **app.nwis.io** dapp is now configured to use **Sepolia testnet** for safe testing!

---

## 📋 What Was Changed

### **1. Contract Address**
```typescript
// lib/constants.ts
PRESALE_CONTRACT_ADDRESS = "0xfA9394b5624B7a608079Db4B04D5d55715b8ad7E"
```

### **2. Network Configuration**
```typescript
// lib/constants.ts
REQUIRED_NETWORK = NETWORKS.SEPOLIA  // Chain ID: 11155111
```

### **3. Token Addresses (Sepolia Testnet)**
```typescript
TOKEN_ADDRESSES = {
  USDT: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0"
  USDC: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8"
  ETH: "0x0000000000000000000000000000000000000000"
}
```

### **4. Wagmi Configuration**
```typescript
// lib/wagmi.ts
chains: [sepolia, mainnet] // Sepolia first for testing
```

---

## 🔧 Setup Instructions

### **Step 1: Copy Environment File (Optional)**

The environment variables are already set in the code, but if you want to customize:

```bash
cd /Users/arashsarabian/Desktop/NexusWealthVGit/dapp
cp env.example .env.local
# Edit .env.local as needed
```

### **Step 2: Run Development Server**

```bash
cd /Users/arashsarabian/Desktop/NexusWealthVGit/dapp
npm run dev
```

The dapp will start on http://localhost:3001

---

## 💰 Getting Test ETH

You'll need Sepolia ETH to test transactions. Get free testnet ETH from:

### **Faucets:**

1. **Sepolia Faucet** (easiest)
   - https://sepoliafaucet.com/
   - Requires Alchemy account (free)
   - Gives 0.5 ETH per day

2. **QuickNode Faucet**
   - https://faucet.quicknode.com/ethereum/sepolia
   - Gives 0.1 ETH
   - Multiple times per day

3. **Infura Faucet**
   - https://www.infura.io/faucet/sepolia
   - Requires Infura account

4. **Alchemy Faucet**
   - https://sepoliafaucet.com/
   - Most reliable
   - 0.5 ETH per request

---

## 🧪 Testing Workflow

### **1. Connect Your Wallet**

1. Open http://localhost:3001
2. Click "Connect Wallet"
3. Select MetaMask (or your preferred wallet)
4. **Switch to Sepolia network**
   - MetaMask will prompt you to switch
   - Or manually switch in MetaMask

### **2. Add Sepolia Network to MetaMask**

If Sepolia isn't showing up:

**Network Details:**
- Network Name: `Sepolia Test Network`
- RPC URL: `https://sepolia.infura.io/v3/`
- Chain ID: `11155111`
- Currency Symbol: `ETH`
- Block Explorer: `https://sepolia.etherscan.io`

Or just let MetaMask add it automatically when you try to connect!

### **3. Get Test Tokens**

**Get Sepolia ETH:**
- Use faucets listed above
- You'll need at least 0.01 ETH for testing

**Get Test USDT/USDC (if testing with stablecoins):**
- For USDT: https://sepolia.etherscan.io/address/0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0
- For USDC: https://sepolia.etherscan.io/address/0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8
- You may need to request from contract owner or faucet

### **4. Test Token Purchase**

1. **Enter amount** of tokens you want to buy
2. **Select currency** (ETH, USDT, or USDC)
3. **Click "Buy Now"**
4. **Approve transaction** in MetaMask
5. **Wait for confirmation**
6. **Check transaction** on Sepolia Etherscan

---

## 🔍 Verify Your Contract

Check your presale contract on Sepolia:

**Contract Address:** `0xfA9394b5624B7a608079Db4B04D5d55715b8ad7E`

**Etherscan URL:**
https://sepolia.etherscan.io/address/0xfA9394b5624B7a608079Db4B04D5d55715b8ad7E

You should see:
- Contract code
- All transactions
- Contract functions (if verified)

---

## 📊 Key Information

| Item | Value |
|------|-------|
| **Network** | Sepolia Testnet |
| **Chain ID** | 11155111 |
| **Presale Contract** | `0xfA9394b5624B7a608079Db4B04D5d55715b8ad7E` |
| **USDT (Sepolia)** | `0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0` |
| **USDC (Sepolia)** | `0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8` |
| **Block Explorer** | https://sepolia.etherscan.io |

---

## 🧪 Test Scenarios

### **Test 1: Basic ETH Purchase**
```
1. Connect wallet with Sepolia ETH
2. Enter: 1000 tokens
3. Select: ETH
4. Click: Buy Now
5. Confirm transaction
6. Verify on Etherscan
```

### **Test 2: USDT Purchase (with Approval)**
```
1. Get test USDT tokens
2. Enter: 1000 tokens
3. Select: USDT
4. Click: Approve USDT (first transaction)
5. Wait for approval confirmation
6. Click: Buy Now (second transaction)
7. Confirm purchase
8. Verify on Etherscan
```

### **Test 3: Network Switching**
```
1. Connect on Mainnet
2. App should show "Wrong Network" error
3. Click "Switch to Sepolia"
4. MetaMask prompts network switch
5. Approve switch
6. App now shows buy interface
```

### **Test 4: Mobile Testing**
```
1. Open dapp in MetaMask mobile browser
2. Should auto-connect to MetaMask
3. Test purchase flow
4. Verify responsive design
```

---

## 🐛 Troubleshooting

### **Issue: "Wrong Network" Error**
**Solution:** Switch to Sepolia in MetaMask

### **Issue: "Insufficient Balance"**
**Solution:** Get Sepolia ETH from faucets listed above

### **Issue: "Transaction Failed"**
**Possible Causes:**
- Not enough gas (get more Sepolia ETH)
- Contract function revert (check contract on Etherscan)
- Wrong token address
- Network congestion (try again)

### **Issue: "Approval Failed"**
**Solution:** 
- Make sure you have test USDT/USDC
- Check token balance
- Try increasing gas limit

### **Issue: MetaMask Not Connecting**
**Solution:**
- Refresh page
- Disconnect and reconnect wallet
- Clear MetaMask cache
- Try different browser

---

## 📱 Testing Checklist

Before deploying to production:

- [ ] Wallet connects on Sepolia
- [ ] Network switching works
- [ ] ETH purchases work
- [ ] USDT purchases work (approval + buy)
- [ ] USDC purchases work (approval + buy)
- [ ] Transaction confirmations show
- [ ] Error messages display correctly
- [ ] Mobile browser works
- [ ] MetaMask mobile browser works
- [ ] Trust Wallet works
- [ ] Amount calculations correct
- [ ] Gas estimates reasonable
- [ ] UI responsive on all devices
- [ ] Video background works (desktop)
- [ ] All links redirect correctly

---

## 🔄 Switching Back to Mainnet

When ready for production, update these files:

### **1. lib/constants.ts**
```typescript
PRESALE_CONTRACT_ADDRESS = "0xYourMainnetAddress"
REQUIRED_NETWORK = NETWORKS.MAINNET
TOKEN_ADDRESSES = {
  USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7"
  USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
  ETH: "0x0000000000000000000000000000000000000000"
}
```

### **2. lib/wagmi.ts**
```typescript
chains: [mainnet, sepolia] // Mainnet first
```

---

## 📊 Test Data

### **Sample Test Accounts**

Use your own MetaMask account, but here's what you'll need:

**Required Balances:**
- Sepolia ETH: ~0.01 ETH (for gas)
- Test USDT: Optional for testing stablecoin purchases
- Test USDC: Optional for testing stablecoin purchases

**Transaction Costs:**
- ETH Purchase: ~0.001-0.003 ETH gas
- USDT Approval: ~0.0005 ETH gas
- USDT Purchase: ~0.002-0.004 ETH gas

---

## 🎯 Success Criteria

Your testing is successful when:

1. ✅ Wallet connects to Sepolia without issues
2. ✅ Can switch from other networks to Sepolia
3. ✅ ETH purchases complete successfully
4. ✅ USDT/USDC approvals work
5. ✅ USDT/USDC purchases work
6. ✅ Transactions confirm on Sepolia Etherscan
7. ✅ UI shows correct amounts and conversions
8. ✅ Error handling works properly
9. ✅ Mobile experience is smooth
10. ✅ No console errors

---

## 🚀 After Testing

Once testing is complete:

1. **Document any issues** found
2. **Fix bugs** if needed
3. **Test fixes** on Sepolia
4. **Switch to mainnet** configuration
5. **Deploy to production**

---

## 📞 Need Help?

### **Resources**

- **Sepolia Faucets:** https://sepoliafaucet.com/
- **Block Explorer:** https://sepolia.etherscan.io
- **Wagmi Docs:** https://wagmi.sh
- **MetaMask Docs:** https://docs.metamask.io

### **Common Commands**

```bash
# Run dev server
cd dapp && npm run dev

# Build for production
npm run build

# Check logs (if deployed)
gcloud logging read "resource.labels.service_name=nexuswealth-dapp-v2" --limit 50
```

---

## ✅ Summary

Your dapp is now configured for **Sepolia testnet** testing:

- ✅ **Presale Contract:** `0xfA9394b5624B7a608079Db4B04D5d55715b8ad7E`
- ✅ **Network:** Sepolia (Chain ID: 11155111)
- ✅ **Token Addresses:** Sepolia testnet tokens
- ✅ **Ready to test:** Just run `npm run dev`

**No real money will be used. All transactions are on testnet!** 🎉

---

*Last updated: October 11, 2025*
*Network: Sepolia Testnet*
*Contract: 0xfA9394b5624B7a608079Db4B04D5d55715b8ad7E*

