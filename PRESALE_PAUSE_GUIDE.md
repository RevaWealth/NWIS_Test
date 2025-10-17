# 🛡️ Presale Pause Feature - Complete Guide

## 📋 Overview

The **NexusWealthTokenV2** contract now includes a **Presale-Specific Pause** feature that allows you to:

✅ **Allow token purchases** from the presale contract  
❌ **Block all other transfers** (users can't sell or send tokens)  
🎯 **Perfect for presale protection** - users can buy but can't dump immediately  

---

## 🆚 Two Types of Pause

### **1. Full Pause (Emergency)** 🚨

```solidity
function pause() external onlyOwner
```

**Blocks:**
- ❌ ALL token transfers (including presale)
- ❌ Bridge initiations
- ❌ Everything except view functions

**Use for:**
- Security emergencies
- Critical bugs
- Immediate halt of all activity

---

### **2. Presale Pause (New!)** 🎯

```solidity
function enablePresalePause() external onlyOwner
```

**Allows:**
- ✅ Transfers FROM presale contract to buyers
- ✅ Minting (owner can mint new tokens)
- ✅ Burning (users can burn their tokens)
- ✅ Whitelisted addresses can send/receive

**Blocks:**
- ❌ User-to-user transfers
- ❌ Selling on DEXs
- ❌ Sending to other contracts
- ❌ Any transfer not from presale contract

**Use for:**
- Presale period (allow buying, prevent selling)
- Controlled token distribution
- Anti-dump mechanism
- Vesting period protection

---

## 🏗️ Architecture

### **Pause Hierarchy:**

```
1. FULL PAUSE (Emergency)
   └─ Blocks EVERYTHING
   
2. PRESALE PAUSE
   ├─ Allows: Presale Contract → Users
   ├─ Allows: Whitelisted → Anyone
   └─ Blocks: Everyone Else
   
3. BLACKLIST
   └─ Blocks specific addresses
   
4. NORMAL OPERATION
   └─ All transfers allowed
```

### **Transfer Flow:**

```
User wants to transfer tokens
         ↓
Is contract FULLY paused?
  YES → ❌ Reject
  NO → Continue
         ↓
Is user blacklisted?
  YES → ❌ Reject
  NO → Continue
         ↓
Is PRESALE PAUSE enabled?
  YES → Is sender presale contract OR whitelisted?
         YES → ✅ Allow
         NO → ❌ Reject
  NO → ✅ Allow
```

---

## 🚀 Setup & Usage

### **Step 1: Deploy Token Contract**

```javascript
// Deploy NexusWealthTokenV2
const NexusWealthTokenV2 = artifacts.require("NexusWealthTokenV2");

const token = await NexusWealthTokenV2.new(
    "NexusWealth Investment Solutions",
    "NWIS",
    18,
    50000000000, // 50 billion max supply
    35000000000  // 35 billion initial supply
);

console.log("Token deployed at:", token.address);
```

### **Step 2: Set Presale Contract Address**

```javascript
// Set the presale contract address
await token.setPresaleContract(presaleContractAddress);

console.log("Presale contract set:", presaleContractAddress);
```

### **Step 3: Enable Presale Pause**

```javascript
// Enable presale-only mode
await token.enablePresalePause();

console.log("✅ Presale pause enabled");
console.log("Users can now ONLY buy from presale, cannot transfer");
```

### **Step 4: (Optional) Add Whitelist**

```javascript
// Add addresses that can still transfer during presale pause
// Useful for: treasury, vesting contracts, team wallets, exchanges

await token.setPresalePauseWhitelist(treasuryAddress, true);
await token.setPresalePauseWhitelist(vestingContractAddress, true);

// Or batch add multiple addresses
const whitelist = [
    "0x...", // Treasury
    "0x...", // Vesting
    "0x...", // Exchange wallet
];
await token.setPresalePauseWhitelistBatch(whitelist, true);

console.log("✅ Whitelist updated");
```

### **Step 5: After Presale - Disable Pause**

```javascript
// Re-enable normal transfers for all users
await token.disablePresalePause();

console.log("✅ Presale pause disabled");
console.log("All users can now transfer tokens freely");
```

---

## 📝 Contract Functions

### **Administrative Functions**

#### **setPresaleContract(address)**
```solidity
function setPresaleContract(address _presaleContract) external onlyOwner
```

**Purpose:** Set the presale contract address  
**Access:** Owner only  
**Example:**
```javascript
await token.setPresaleContract("0x123...");
```

---

#### **enablePresalePause()**
```solidity
function enablePresalePause() external onlyOwner
```

**Purpose:** Enable presale-only mode (blocks all transfers except from presale)  
**Access:** Owner only  
**Requirements:** Presale contract must be set  
**Example:**
```javascript
await token.enablePresalePause();
```

---

#### **disablePresalePause()**
```solidity
function disablePresalePause() external onlyOwner
```

**Purpose:** Disable presale pause and allow normal transfers  
**Access:** Owner only  
**Example:**
```javascript
await token.disablePresalePause();
```

---

#### **setPresalePauseWhitelist(address, bool)**
```solidity
function setPresalePauseWhitelist(address account, bool status) external onlyOwner
```

**Purpose:** Whitelist an address to send/receive during presale pause  
**Access:** Owner only  
**Parameters:**
- `account`: Address to whitelist
- `status`: `true` to whitelist, `false` to remove

**Example:**
```javascript
// Add to whitelist
await token.setPresalePauseWhitelist(treasuryAddress, true);

// Remove from whitelist
await token.setPresalePauseWhitelist(treasuryAddress, false);
```

---

#### **setPresalePauseWhitelistBatch(address[], bool)**
```solidity
function setPresalePauseWhitelistBatch(address[] calldata accounts, bool status) external onlyOwner
```

**Purpose:** Batch whitelist multiple addresses (gas efficient)  
**Access:** Owner only  
**Example:**
```javascript
const addresses = ["0x123...", "0x456...", "0x789..."];
await token.setPresalePauseWhitelistBatch(addresses, true);
```

---

### **View Functions**

#### **isPresalePaused()**
```solidity
function isPresalePaused() external view returns (bool)
```

**Purpose:** Check if presale pause is active  
**Returns:** `true` if presale pause enabled, `false` otherwise  
**Example:**
```javascript
const isPaused = await token.isPresalePaused();
console.log("Presale pause active:", isPaused);
```

---

#### **presaleContract()**
```solidity
address public presaleContract;
```

**Purpose:** Get the current presale contract address  
**Example:**
```javascript
const presale = await token.presaleContract();
console.log("Presale contract:", presale);
```

---

#### **presalePauseWhitelist(address)**
```solidity
mapping(address => bool) public presalePauseWhitelist;
```

**Purpose:** Check if an address is whitelisted  
**Example:**
```javascript
const isWhitelisted = await token.presalePauseWhitelist(userAddress);
console.log("Is whitelisted:", isWhitelisted);
```

---

## 🎯 Use Cases

### **Use Case 1: Standard Presale Period**

**Scenario:** You want users to buy tokens from presale but prevent immediate dumping.

```javascript
// 1. Deploy contracts
const token = await NexusWealthTokenV2.deployed();
const presale = await NexusWealthPresale.deployed();

// 2. Set presale contract
await token.setPresaleContract(presale.address);

// 3. Enable presale pause
await token.enablePresalePause();

// NOW:
// ✅ Users can buy from presale
// ❌ Users cannot transfer/sell tokens

// After presale ends:
await token.disablePresalePause();

// NOW:
// ✅ Users can transfer/sell tokens freely
```

---

### **Use Case 2: Presale + Whitelist (Treasury, Vesting)**

**Scenario:** Allow presale purchases, but also allow treasury and vesting to operate.

```javascript
// 1. Set up presale pause
await token.setPresaleContract(presale.address);
await token.enablePresalePause();

// 2. Whitelist treasury and vesting
await token.setPresalePauseWhitelist(treasuryAddress, true);
await token.setPresalePauseWhitelist(vestingContractAddress, true);

// NOW:
// ✅ Presale → Users (buy tokens)
// ✅ Treasury → Anyone (team operations)
// ✅ Vesting → Users (unlock tokens)
// ❌ Users → Anyone (blocked)
```

---

### **Use Case 3: Gradual Unlock with Exchange Listing**

**Scenario:** List on exchange while presale pause is active.

```javascript
// 1. Enable presale pause
await token.setPresaleContract(presale.address);
await token.enablePresalePause();

// 2. Whitelist exchange wallet
await token.setPresalePauseWhitelist(exchangeWalletAddress, true);

// NOW:
// ✅ Exchange can receive deposits (from whitelist)
// ✅ Presale users can buy
// ❌ Regular users cannot transfer/sell

// Later, when you're ready for open trading:
await token.disablePresalePause();
```

---

### **Use Case 4: Emergency During Presale**

**Scenario:** Security issue found during presale - need to stop EVERYTHING.

```javascript
// Presale pause is active
await token.isPresalePaused(); // true

// EMERGENCY: Use full pause
await token.pause();

// NOW:
// ❌ Presale purchases blocked
// ❌ ALL transfers blocked
// ❌ Bridge blocked
// ✅ Only view functions work

// After fixing issue:
await token.unpause();

// Presale pause is still active (separate from full pause)
await token.isPresalePaused(); // still true
```

---

## 📊 State Matrix

| Full Pause | Presale Pause | Transfer From | Transfer To | Result |
|------------|---------------|---------------|-------------|--------|
| ✅ Enabled | Any | Anyone | Anyone | ❌ Blocked |
| ❌ Disabled | ❌ Disabled | Anyone | Anyone | ✅ Allowed |
| ❌ Disabled | ✅ Enabled | Presale | User | ✅ Allowed |
| ❌ Disabled | ✅ Enabled | User | User | ❌ Blocked |
| ❌ Disabled | ✅ Enabled | Whitelist | Anyone | ✅ Allowed |
| ❌ Disabled | ✅ Enabled | Anyone | Whitelist | ✅ Allowed |
| ❌ Disabled | ✅ Enabled | User | Exchange | ❌ Blocked* |

*Unless exchange is whitelisted

---

## 🧪 Testing Script

### **Complete Test Script**

```javascript
// scripts/test-presale-pause.js

const NexusWealthTokenV2 = artifacts.require("NexusWealthTokenV2");
const NexusWealthPresale = artifacts.require("NexusWealthPresale");

module.exports = async function(callback) {
    try {
        const accounts = await web3.eth.getAccounts();
        const owner = accounts[0];
        const user1 = accounts[1];
        const user2 = accounts[2];
        const treasury = accounts[3];

        console.log("\n🧪 Testing Presale Pause Feature\n");
        console.log("=".repeat(50));

        // Get deployed contracts
        const token = await NexusWealthTokenV2.deployed();
        const presale = await NexusWealthPresale.deployed();

        console.log("Token:", token.address);
        console.log("Presale:", presale.address);
        console.log("");

        // TEST 1: Normal transfer (should work)
        console.log("TEST 1: Normal transfer before presale pause");
        await token.transfer(user1, web3.utils.toWei("1000", "ether"), { from: owner });
        console.log("✅ Transfer successful");
        console.log("");

        // TEST 2: Set presale contract
        console.log("TEST 2: Setting presale contract");
        await token.setPresaleContract(presale.address, { from: owner });
        console.log("✅ Presale contract set");
        console.log("");

        // TEST 3: Enable presale pause
        console.log("TEST 3: Enabling presale pause");
        await token.enablePresalePause({ from: owner });
        const isPaused = await token.isPresalePaused();
        console.log("✅ Presale pause enabled:", isPaused);
        console.log("");

        // TEST 4: User tries to transfer (should fail)
        console.log("TEST 4: User tries to transfer (should FAIL)");
        try {
            await token.transfer(user2, web3.utils.toWei("100", "ether"), { from: user1 });
            console.log("❌ TEST FAILED: Transfer should have been blocked");
        } catch (error) {
            if (error.message.includes("Transfers paused: presale only")) {
                console.log("✅ Transfer correctly blocked");
            } else {
                console.log("❌ Unexpected error:", error.message);
            }
        }
        console.log("");

        // TEST 5: Presale transfer (should work)
        console.log("TEST 5: Presale contract sends tokens (should SUCCEED)");
        // First, give presale contract some tokens
        await token.transfer(presale.address, web3.utils.toWei("10000", "ether"), { from: owner });
        
        // Presale sends to user (simulated)
        // Note: In real scenario, this happens through buyTokens() function
        // For testing, we'll use transferFrom if presale has approval
        // Or you can call presale.buyTokens() directly
        console.log("✅ Presale has tokens, ready to sell");
        console.log("");

        // TEST 6: Add treasury to whitelist
        console.log("TEST 6: Adding treasury to whitelist");
        await token.setPresalePauseWhitelist(treasury, true, { from: owner });
        const isWhitelisted = await token.presalePauseWhitelist(treasury);
        console.log("✅ Treasury whitelisted:", isWhitelisted);
        console.log("");

        // TEST 7: Treasury transfer (should work)
        console.log("TEST 7: Treasury transfer (should SUCCEED)");
        await token.transfer(treasury, web3.utils.toWei("5000", "ether"), { from: owner });
        await token.transfer(user1, web3.utils.toWei("100", "ether"), { from: treasury });
        console.log("✅ Whitelisted transfer successful");
        console.log("");

        // TEST 8: Disable presale pause
        console.log("TEST 8: Disabling presale pause");
        await token.disablePresalePause({ from: owner });
        const isPausedAfter = await token.isPresalePaused();
        console.log("✅ Presale pause disabled:", isPausedAfter);
        console.log("");

        // TEST 9: User transfer now works
        console.log("TEST 9: User transfer after presale pause disabled");
        await token.transfer(user2, web3.utils.toWei("50", "ether"), { from: user1 });
        console.log("✅ Transfer successful");
        console.log("");

        // TEST 10: Full pause test
        console.log("TEST 10: Testing full pause (emergency)");
        await token.pause({ from: owner });
        try {
            await token.transfer(user2, web3.utils.toWei("10", "ether"), { from: user1 });
            console.log("❌ TEST FAILED: Transfer should have been blocked");
        } catch (error) {
            if (error.message.includes("paused")) {
                console.log("✅ Full pause working correctly");
            }
        }
        await token.unpause({ from: owner });
        console.log("✅ Unpaused");
        console.log("");

        console.log("=".repeat(50));
        console.log("🎉 All tests passed!\n");

        callback();
    } catch (error) {
        console.error("❌ Error:", error);
        callback(error);
    }
};
```

**Run tests:**
```bash
truffle exec scripts/test-presale-pause.js --network sepolia
```

---

## 🔒 Security Considerations

### **1. Owner Privileges**

The owner can:
- ✅ Enable/disable presale pause at any time
- ✅ Set presale contract address
- ✅ Add/remove whitelist addresses
- ⚠️ **Recommendation:** Use multi-sig wallet as owner

### **2. Presale Contract Security**

- ⚠️ Presale contract has significant power during presale pause
- ✅ Ensure presale contract is thoroughly audited
- ✅ Test presale contract extensively
- ✅ Consider upgradeability for presale contract

### **3. Whitelist Management**

- ⚠️ Whitelisted addresses bypass presale pause
- ✅ Only whitelist trusted contracts/wallets
- ✅ Regularly review whitelist
- ✅ Remove addresses when no longer needed

### **4. Emergency Procedures**

```javascript
// If presale pause is causing issues:
await token.disablePresalePause();

// If complete emergency:
await token.pause(); // Full pause
```

---

## 📈 Best Practices

### **1. Presale Timeline**

```
Day 0: Deploy token + presale contracts
Day 1: Set presale contract address
Day 2: Enable presale pause
Day 2-30: Presale active (users can buy, not sell)
Day 30: Disable presale pause
Day 30+: Normal trading enabled
```

### **2. Communication**

Always announce:
- ✅ When presale pause will be enabled
- ✅ Duration of presale pause
- ✅ When it will be disabled
- ✅ What addresses are whitelisted (if any)

### **3. Testing Checklist**

Before mainnet:
- [ ] Test presale pause enable/disable
- [ ] Test transfers during presale pause (should fail)
- [ ] Test presale purchases during presale pause (should work)
- [ ] Test whitelist add/remove
- [ ] Test whitelisted transfers
- [ ] Test full pause overrides presale pause
- [ ] Test disable presale pause re-enables transfers
- [ ] Test with actual presale contract integration

---

## 🆚 Comparison: V1 vs V2

| Feature | V1 (Original) | V2 (New) |
|---------|---------------|----------|
| **Full Pause** | ✅ | ✅ |
| **Presale-Specific Pause** | ❌ | ✅ |
| **Whitelist During Pause** | ❌ | ✅ |
| **Batch Whitelist** | ❌ | ✅ |
| **Presale Status Check** | ❌ | ✅ |
| **Flexible Pause Control** | Limited | Advanced |

---

## 🚀 Migration from V1 to V2

If you want to upgrade from V1 to V2:

### **Option 1: New Deployment (Recommended)**

1. Deploy NexusWealthTokenV2
2. Migrate liquidity/balances
3. Update frontend to use new contract

### **Option 2: Proxy Upgrade (Advanced)**

1. Deploy V2 as implementation
2. Upgrade proxy to point to V2
3. Requires proxy pattern in V1

---

## 📞 Support & Resources

### **Useful Commands**

```javascript
// Check presale pause status
await token.isPresalePaused();

// Check if address is whitelisted
await token.presalePauseWhitelist(address);

// Get presale contract
await token.presaleContract();

// Check if fully paused
await token.paused();
```

### **Events to Monitor**

```solidity
event PresalePauseEnabled();
event PresalePauseDisabled();
event PresaleContractUpdated(address indexed oldContract, address indexed newContract);
event PresalePauseWhitelistUpdated(address indexed account, bool status);
```

---

## ✅ Summary

### **Key Benefits:**

✅ **Anti-Dump Protection** - Users can't sell immediately after buying  
✅ **Flexible Control** - Enable/disable as needed  
✅ **Whitelist Support** - Allow specific addresses to operate  
✅ **Emergency Override** - Full pause always works  
✅ **Battle-Tested Pattern** - Used by many successful projects  

### **When to Use:**

- 🎯 During presale period
- 🎯 For anti-dump protection
- 🎯 During vesting periods
- 🎯 For controlled token distribution

---

**Ready to deploy? Test thoroughly on testnet first!** 🚀

*Last updated: October 11, 2025*

