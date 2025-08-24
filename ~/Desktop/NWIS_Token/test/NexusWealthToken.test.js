const NexusWealthToken = artifacts.require("NexusWealthToken");

contract("NexusWealthToken", (accounts) => {
  let token;
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];

  beforeEach(async () => {
    token = await NexusWealthToken.new(
      "NexusWealth Investment Solutions",
      "NWIS",
      18,
      web3.utils.toWei("50000000000", "ether"), // 50 billion max supply
      web3.utils.toWei("50000000000", "ether")  // 50 billion initial supply
    );
  });

  describe("Basic Token Information", () => {
    it("should have correct name", async () => {
      const name = await token.name();
      assert.equal(name, "NexusWealth Investment Solutions");
    });

    it("should have correct symbol", async () => {
      const symbol = await token.symbol();
      assert.equal(symbol, "NWIS");
    });

    it("should have correct decimals", async () => {
      const decimals = await token.decimals();
      assert.equal(decimals, 18);
    });

    it("should have correct total supply", async () => {
      const totalSupply = await token.totalSupply();
      assert.equal(totalSupply.toString(), web3.utils.toWei("50000000000", "ether"));
    });

    it("should have correct max supply", async () => {
      const maxSupply = await token.maxSupply();
      assert.equal(maxSupply.toString(), web3.utils.toWei("50000000000", "ether"));
    });
  });

  describe("Owner Functions", () => {
    it("should set correct owner", async () => {
      const contractOwner = await token.owner();
      assert.equal(contractOwner, owner);
    });

    it("should allow owner to mint tokens", async () => {
      const initialBalance = await token.balanceOf(user1);
      const mintAmount = web3.utils.toWei("1000", "ether");
      
      await token.mint(user1, mintAmount, { from: owner });
      
      const finalBalance = await token.balanceOf(user1);
      assert.equal(finalBalance.toString(), initialBalance.add(mintAmount).toString());
    });

    it("should not allow non-owner to mint tokens", async () => {
      const mintAmount = web3.utils.toWei("1000", "ether");
      
      try {
        await token.mint(user1, mintAmount, { from: user1 });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error.message.includes("Not authorized"));
      }
    });
  });

  describe("Token Transfers", () => {
    it("should allow token transfers", async () => {
      const transferAmount = web3.utils.toWei("1000", "ether");
      const initialBalance = await token.balanceOf(user1);
      
      await token.transfer(user1, transferAmount, { from: owner });
      
      const finalBalance = await token.balanceOf(user1);
      assert.equal(finalBalance.toString(), initialBalance.add(transferAmount).toString());
    });

    it("should allow token burning", async () => {
      const burnAmount = web3.utils.toWei("1000", "ether");
      const initialBalance = await token.balanceOf(owner);
      
      await token.burn(burnAmount, { from: owner });
      
      const finalBalance = await token.balanceOf(owner);
      assert.equal(finalBalance.toString(), initialBalance.sub(burnAmount).toString());
    });
  });

  describe("Voting System", () => {
    it("should allow proposal creation", async () => {
      const description = "Test Proposal";
      
      const tx = await token.createProposal(description, { from: owner });
      
      // Check if proposal was created
      const proposal = await token.getProposal(0);
      assert.equal(proposal.description, description);
    });

    it("should allow voting on proposals", async () => {
      // Create proposal first
      await token.createProposal("Test Proposal", { from: owner });
      
      // Vote on proposal
      await token.castVote(0, true, { from: owner });
      
      // Check if vote was recorded
      const hasVoted = await token.getVoteInfo(0, owner);
      assert.equal(hasVoted, true);
    });
  });

  describe("Bridge Functionality", () => {
    it("should set bridge operators", async () => {
      await token.setBridgeOperator(user1, true, { from: owner });
      
      const isOperator = await token.bridgeOperators(user1);
      assert.equal(isOperator, true);
    });

    it("should have correct bridge parameters", async () => {
      const maxBridgeAmount = await token.maxBridgeAmount();
      const bridgeFee = await token.bridgeFee();
      
      // Check if bridge parameters are set correctly
      assert.equal(maxBridgeAmount.toString(), web3.utils.toWei("50000000", "ether"));
      assert.equal(bridgeFee.toString(), web3.utils.toWei("0.001", "ether"));
    });
  });

  describe("Blacklist Functionality", () => {
    it("should allow setting blacklist status", async () => {
      await token.setBlacklistStatus(user1, true, { from: owner });
      
      const isBlacklisted = await token.isBlacklisted(user1);
      assert.equal(isBlacklisted, true);
    });

    it("should prevent blacklisted accounts from transferring", async () => {
      // Blacklist user1
      await token.setBlacklistStatus(user1, true, { from: owner });
      
      // Try to transfer from blacklisted account
      try {
        await token.transfer(user2, web3.utils.toWei("1000", "ether"), { from: user1 });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error.message.includes("Sender is blacklisted"));
      }
    });
  });
});


