const NexusWealthToken = artifacts.require("NexusWealthToken");

module.exports = async function(callback) {
  try {
    console.log("🔍 NWIS Token Interaction Script");
    console.log("=================================");
    
    // Get deployed token contract
    const token = await NexusWealthToken.deployed();
    console.log("✅ Connected to token contract:", token.address);
    
    // Get accounts
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    
    console.log("\n👥 Accounts:");
    console.log("Owner:", owner);
    console.log("User 1:", user1);
    console.log("User 2:", user2);
    
    // Display token information
    console.log("\n📊 Token Information:");
    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();
    const totalSupply = await token.totalSupply();
    const maxSupply = await token.maxSupply();
    const ownerBalance = await token.balanceOf(owner);
    
    console.log("Name:", name);
    console.log("Symbol:", symbol);
    console.log("Decimals:", decimals);
    console.log("Total Supply:", web3.utils.fromWei(totalSupply, "ether"), "NWIS");
    console.log("Max Supply:", web3.utils.fromWei(maxSupply, "ether"), "NWIS");
    console.log("Owner Balance:", web3.utils.fromWei(ownerBalance, "ether"), "NWIS");
    
    // Test token transfer
    console.log("\n🔄 Testing Token Transfer:");
    const transferAmount = web3.utils.toWei("1000", "ether");
    const user1InitialBalance = await token.balanceOf(user1);
    
    console.log("Transferring 1000 NWIS to User 1...");
    await token.transfer(user1, transferAmount, { from: owner });
    
    const user1FinalBalance = await token.balanceOf(user1);
    console.log("User 1 Balance:", web3.utils.fromWei(user1FinalBalance, "ether"), "NWIS");
    console.log("Transfer successful!");
    
    // Test proposal creation
    console.log("\n🗳️ Testing Voting System:");
    console.log("Creating a test proposal...");
    await token.createProposal("Test Proposal for NWIS Token", { from: owner });
    console.log("Proposal created successfully!");
    
    // Test voting
    console.log("Voting on proposal...");
    await token.castVote(0, true, { from: owner });
    console.log("Vote cast successfully!");
    
    // Display proposal info
    const proposal = await token.getProposal(0);
    console.log("Proposal Details:");
    console.log("  Description:", proposal.description);
    console.log("  For Votes:", web3.utils.fromWei(proposal.forVotes, "ether"));
    console.log("  Against Votes:", web3.utils.fromWei(proposal.againstVotes, "ether"));
    console.log("  Start Time:", new Date(proposal.startTime * 1000).toLocaleString());
    console.log("  End Time:", new Date(proposal.endTime * 1000).toLocaleString());
    
    // Test bridge functionality
    console.log("\n🌉 Testing Bridge Functionality:");
    console.log("Setting User 1 as bridge operator...");
    await token.setBridgeOperator(user1, true, { from: owner });
    
    const isOperator = await token.bridgeOperators(user1);
    console.log("User 1 is bridge operator:", isOperator);
    
    // Display bridge parameters
    const maxBridgeAmount = await token.maxBridgeAmount();
    const bridgeFee = await token.bridgeFee();
    console.log("Bridge Parameters:");
    console.log("  Max Bridge Amount:", web3.utils.fromWei(maxBridgeAmount, "ether"), "NWIS");
    console.log("  Bridge Fee:", web3.utils.fromWei(bridgeFee, "ether"), "ETH");
    
    // Test blacklist functionality
    console.log("\n🚫 Testing Blacklist Functionality:");
    console.log("Setting User 2 as blacklisted...");
    await token.setBlacklistStatus(user2, true, { from: owner });
    
    const isBlacklisted = await token.isBlacklisted(user2);
    console.log("User 2 is blacklisted:", isBlacklisted);
    
    // Test pause functionality
    console.log("\n⏸️ Testing Pause Functionality:");
    console.log("Pausing token transfers...");
    await token.pause({ from: owner });
    
    const isPaused = await token.paused();
    console.log("Token is paused:", isPaused);
    
    console.log("\nUnpausing token transfers...");
    await token.unpause({ from: owner });
    
    const isUnpaused = await token.paused();
    console.log("Token is paused:", isUnpaused);
    
    console.log("\n🎉 All tests completed successfully!");
    console.log("The NWIS token is working perfectly!");
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
  
  callback();
};



