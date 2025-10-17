# 🚀 Presale Pause - Quick Reference

## ⚡ TL;DR

**Problem:** Users buy tokens from presale and immediately dump them.

**Solution:** Enable presale pause mode:
- ✅ Users CAN buy from presale
- ❌ Users CANNOT transfer/sell tokens
- ⏰ Disable pause after presale ends

---

## 🔧 Quick Setup (3 Steps)

```javascript
// 1. Set presale contract
await token.setPresaleContract(presaleAddress);

// 2. Enable presale pause
await token.enablePresalePause();

// 3. After presale ends - disable
await token.disablePresalePause();
```

---

## 📋 Function Cheat Sheet

| Function | Purpose | Access | Gas Cost |
|----------|---------|--------|----------|
| `setPresaleContract(address)` | Set presale contract | Owner | Low |
| `enablePresalePause()` | Block all transfers except presale | Owner | Low |
| `disablePresalePause()` | Re-enable normal transfers | Owner | Low |
| `setPresalePauseWhitelist(address, bool)` | Whitelist single address | Owner | Low |
| `setPresalePauseWhitelistBatch(address[], bool)` | Whitelist multiple | Owner | Medium |
| `isPresalePaused()` | Check if presale pause active | Anyone | Free |
| `presaleContract()` | Get presale address | Anyone | Free |
| `presalePauseWhitelist(address)` | Check if whitelisted | Anyone | Free |

---

## 🎯 Common Scenarios

### **Scenario 1: Basic Presale**
```javascript
// Before presale
await token.setPresaleContract(presale.address);
await token.enablePresalePause();

// ✅ Users can buy
// ❌ Users cannot sell

// After presale
await token.disablePresalePause();

// ✅ Users can now sell
```

### **Scenario 2: Presale + Whitelist**
```javascript
// Setup
await token.setPresaleContract(presale.address);
await token.enablePresalePause();

// Whitelist treasury and vesting
await token.setPresalePauseWhitelist(treasury, true);
await token.setPresalePauseWhitelist(vesting, true);

// ✅ Presale → Users (buy)
// ✅ Treasury → Anyone (operations)
// ✅ Vesting → Users (unlocks)
// ❌ Users → Anyone (blocked)
```

### **Scenario 3: Emergency Stop**
```javascript
// If something goes wrong during presale
await token.pause(); // Full emergency pause

// ❌ Blocks EVERYTHING (including presale)

// After fixing
await token.unpause();
```

---

## 🔍 State Check Commands

```javascript
// Check presale pause status
const isPaused = await token.isPresalePaused();
console.log("Presale paused:", isPaused);

// Check presale contract
const presale = await token.presaleContract();
console.log("Presale:", presale);

// Check if address is whitelisted
const isWL = await token.presalePauseWhitelist(address);
console.log("Whitelisted:", isWL);

// Check full pause status
const isFullyPaused = await token.paused();
console.log("Fully paused:", isFullyPaused);
```

---

## ⚠️ Important Notes

### **Pause Hierarchy (What Takes Priority)**
```
1. Full Pause (pause()) ← Highest priority
   ↓ Blocks everything
   
2. Presale Pause (enablePresalePause())
   ↓ Blocks user transfers, allows presale
   
3. Blacklist
   ↓ Blocks specific addresses
   
4. Normal Operation ← Default
```

### **Access Control**
- 🔑 **All pause functions:** Owner only
- 👀 **All view functions:** Anyone
- ⚠️ **Use multi-sig** for owner address

### **Common Mistakes**

❌ **Mistake 1:** Enabling presale pause before setting presale contract
```javascript
// WRONG
await token.enablePresalePause(); // Will fail!

// RIGHT
await token.setPresaleContract(presale.address);
await token.enablePresalePause(); // Works!
```

❌ **Mistake 2:** Forgetting to disable after presale
```javascript
// Users will complain they can't transfer!
// Remember to:
await token.disablePresalePause();
```

❌ **Mistake 3:** Confusing full pause with presale pause
```javascript
// Full pause blocks EVERYTHING
await token.pause(); // Even presale can't work

// Presale pause allows presale
await token.enablePresalePause(); // Presale still works
```

---

## 🧪 Testing Checklist

Before mainnet deployment, test:

- [ ] Enable presale pause
- [ ] Verify user→user transfers blocked
- [ ] Verify presale→user transfers work
- [ ] Add address to whitelist
- [ ] Verify whitelisted transfers work
- [ ] Disable presale pause
- [ ] Verify user→user transfers work again
- [ ] Test full pause overrides presale pause
- [ ] Test with actual presale contract
- [ ] Test batch whitelist function

**Run test script:**
```bash
truffle exec scripts/test-presale-pause.js --network sepolia
```

---

## 📊 What Can/Cannot Happen

| Action | Full Pause | Presale Pause | Normal |
|--------|------------|---------------|--------|
| User → User | ❌ | ❌ | ✅ |
| Presale → User | ❌ | ✅ | ✅ |
| Whitelist → Anyone | ❌ | ✅ | ✅ |
| Anyone → Whitelist | ❌ | ✅ | ✅ |
| Mint (owner) | ❌ | ✅ | ✅ |
| Burn (user) | ❌ | ✅ | ✅ |
| View functions | ✅ | ✅ | ✅ |
| Governance voting | ✅ | ✅ | ✅ |

---

## 🚨 Emergency Procedures

### **If presale pause is stuck ON:**
```javascript
await token.disablePresalePause({ from: owner });
```

### **If presale contract needs update:**
```javascript
await token.setPresaleContract(newPresaleAddress, { from: owner });
```

### **If everything needs to stop:**
```javascript
await token.pause({ from: owner });
```

### **If wrong address whitelisted:**
```javascript
await token.setPresalePauseWhitelist(wrongAddress, false, { from: owner });
```

---

## 💡 Pro Tips

### **1. Announce in Advance**
Tell users:
- When presale pause starts
- How long it will last
- When trading will open

### **2. Use Whitelist Strategically**
Whitelist:
- ✅ Treasury (for operations)
- ✅ Vesting contracts (for unlocks)
- ✅ Exchange wallets (for listing)
- ❌ Random users (defeats purpose)

### **3. Test on Testnet First**
```bash
# Deploy to testnet
truffle migrate --network sepolia

# Run full test suite
truffle exec scripts/test-presale-pause.js --network sepolia

# Manual testing with different scenarios
```

### **4. Monitor Events**
```javascript
// Listen for presale pause events
token.events.PresalePauseEnabled()
    .on('data', (event) => {
        console.log("Presale pause enabled!");
    });

token.events.PresalePauseDisabled()
    .on('data', (event) => {
        console.log("Presale pause disabled!");
    });
```

### **5. Set Up Monitoring**
```javascript
// Check status every minute
setInterval(async () => {
    const isPaused = await token.isPresalePaused();
    console.log("Status:", isPaused ? "PAUSED" : "NORMAL");
}, 60000);
```

---

## 📞 Quick Help

### **"Users can't buy from presale"**
```javascript
// Check if presale contract is set correctly
const presale = await token.presaleContract();
console.log("Presale:", presale);

// Check if presale pause is enabled
const isPaused = await token.isPresalePaused();
console.log("Paused:", isPaused);

// Check if contract is fully paused
const isFullyPaused = await token.paused();
console.log("Fully paused:", isFullyPaused);
```

### **"Users can't transfer after presale"**
```javascript
// Disable presale pause
await token.disablePresalePause({ from: owner });

// Verify
const isPaused = await token.isPresalePaused();
console.log("Should be false:", isPaused);
```

### **"Whitelist not working"**
```javascript
// Check if address is actually whitelisted
const isWL = await token.presalePauseWhitelist(address);
console.log("Whitelisted:", isWL);

// If false, add them
await token.setPresalePauseWhitelist(address, true, { from: owner });
```

---

## 🎯 Best Practice Timeline

```
Day -7:  Announce presale with pause details
Day -3:  Deploy contracts to mainnet
Day -1:  Set presale contract address
Day 0:   Enable presale pause, start presale
Day 1-30: Presale active (users buy, can't sell)
Day 30:  Presale ends, disable presale pause
Day 31+: Normal trading (users can sell)
```

---

## 📝 Code Snippets

### **Complete Setup Script**
```javascript
// scripts/setup-presale-pause.js
const token = await NexusWealthTokenV2.deployed();
const presale = await NexusWealthPresale.deployed();

// 1. Set presale
await token.setPresaleContract(presale.address);
console.log("✅ Presale set");

// 2. Enable pause
await token.enablePresalePause();
console.log("✅ Presale pause enabled");

// 3. Add whitelist (optional)
await token.setPresalePauseWhitelist(treasuryAddress, true);
console.log("✅ Treasury whitelisted");
```

### **Monitor Script**
```javascript
// scripts/monitor-presale-pause.js
const token = await NexusWealthTokenV2.at(tokenAddress);

console.log("Monitoring presale pause status...");

setInterval(async () => {
    const isPaused = await token.isPresalePaused();
    const presale = await token.presaleContract();
    const isFullyPaused = await token.paused();
    
    console.log({
        timestamp: new Date().toISOString(),
        presalePause: isPaused,
        fullPause: isFullyPaused,
        presaleContract: presale,
    });
}, 60000); // Every minute
```

---

## 🔗 Related Documentation

- **Full Guide:** `PRESALE_PAUSE_GUIDE.md`
- **Contract:** `contracts/NexusWealthTokenV2.sol`
- **Test Script:** `scripts/test-presale-pause.js`
- **Original Contract:** `contracts/NexusWealthToken.sol`

---

## ✅ Quick Checklist

Before enabling presale pause:
- [ ] Presale contract deployed and tested
- [ ] Token contract deployed (V2)
- [ ] Presale contract address set in token
- [ ] Whitelist addresses added (if any)
- [ ] Team notified
- [ ] Users informed
- [ ] Monitoring set up

After presale ends:
- [ ] Disable presale pause
- [ ] Verify transfers work
- [ ] Announce to community
- [ ] Remove unnecessary whitelists
- [ ] Update documentation

---

**Need more help? See `PRESALE_PAUSE_GUIDE.md` for complete documentation!** 📚

*Last updated: October 11, 2025*

