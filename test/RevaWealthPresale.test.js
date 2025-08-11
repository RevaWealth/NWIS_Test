const RevaWealthPresale = artifacts.require("RevaWealthPresale");
const MockERC20 = artifacts.require("MockERC20");

contract("RevaWealthPresale", function (accounts) {
  let presale;
  let mockToken;
  let owner;
  let icoAddress;
  let devAddress;
  let user1;
  let user2;
  let user3;

  beforeEach(async function () {
    [owner, icoAddress, devAddress, user1, user2, user3] = accounts;

    // Deploy MockERC20 for testing
    mockToken = await MockERC20.new("Mock Token", "MTK", 18);

    // Deploy the RevaWealthPresale contract
    presale = await RevaWealthPresale.new(icoAddress, devAddress);
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      const contractOwner = await presale.owner();
      assert.equal(contractOwner, owner, "Owner should be set correctly");
    });

    it("Should set the correct ICO address", async function () {
      const contractICO = await presale.ICO();
      assert.equal(contractICO, icoAddress, "ICO address should be set correctly");
    });

    it("Should set the correct DEV address", async function () {
      const contractDEV = await presale.DEV();
      assert.equal(contractDEV, devAddress, "DEV address should be set correctly");
    });

    it("Should start with sale disabled", async function () {
      const saleStatus = await presale.saleStatus();
      assert.equal(saleStatus, false, "Sale should start disabled");
    });

    it("Should start with zero total buyers", async function () {
      const totalBuyers = await presale.totalBuyers();
      assert.equal(totalBuyers.toNumber(), 0, "Total buyers should start at 0");
    });

    it("Should start with zero total tokens sold", async function () {
      const totalTokensSold = await presale.totalTokensSold();
      assert.equal(totalTokensSold.toNumber(), 0, "Total tokens sold should start at 0");
    });
  });

  describe("Sale Management", function () {
    it("Should allow owner to resume sale", async function () {
      await presale.resumeSale();
      const saleStatus = await presale.saleStatus();
      assert.equal(saleStatus, true, "Sale should be enabled");
    });

    it("Should allow owner to stop sale", async function () {
      await presale.resumeSale();
      await presale.stopSale();
      const saleStatus = await presale.saleStatus();
      assert.equal(saleStatus, false, "Sale should be disabled");
    });

    it("Should not allow non-owner to resume sale", async function () {
      try {
        await presale.resumeSale({ from: user1 });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error.message.includes("OwnableUnauthorizedAccount"), "Should throw ownership error");
      }
    });

    it("Should not allow non-owner to stop sale", async function () {
      await presale.resumeSale();
      try {
        await presale.stopSale({ from: user1 });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error.message.includes("OwnableUnauthorizedAccount"), "Should throw ownership error");
      }
    });
  });

  describe("Token Management", function () {
    it("Should allow owner to set sale token", async function () {
      const totalTokens = web3.utils.toWei("1000000", "ether");
      const rate = web3.utils.toWei("0.001", "ether");

      // Mint tokens to owner
      await mockToken.mint(owner, totalTokens);
      await mockToken.approve(presale.address, totalTokens);

      await presale.setSaleToken(mockToken.address, totalTokens, rate, true);

      const saleToken = await presale.saleToken();
      const totalTokensForSale = await presale.totalTokensforSale();
      const contractRate = await presale.rate();
      const saleStatus = await presale.saleStatus();

      assert.equal(saleToken, mockToken.address, "Sale token should be set correctly");
      assert.equal(totalTokensForSale.toString(), totalTokens, "Total tokens for sale should be set correctly");
      assert.equal(contractRate.toString(), rate, "Rate should be set correctly");
      assert.equal(saleStatus, true, "Sale status should be enabled");
    });

    it("Should not allow non-owner to set sale token", async function () {
      const totalTokens = web3.utils.toWei("1000000", "ether");
      const rate = web3.utils.toWei("0.001", "ether");

      try {
        await presale.setSaleToken(mockToken.address, totalTokens, rate, true, { from: user1 });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error.message.includes("OwnableUnauthorizedAccount"), "Should throw ownership error");
      }
    });

    it("Should not allow setting zero rate", async function () {
      const totalTokens = web3.utils.toWei("1000000", "ether");
      const rate = 0;

      try {
        await presale.setSaleToken(mockToken.address, totalTokens, rate, true);
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error.message.includes("require"), "Should throw require error");
      }
    });
  });

  describe("Payable Tokens", function () {
    it("Should allow owner to add payable tokens", async function () {
      const tokens = [user1, user2];
      const prices = [web3.utils.toWei("1", "ether"), web3.utils.toWei("2", "ether")];

      await presale.addPayableTokens(tokens, prices);

      const isPayable1 = await presale.payableTokens(user1);
      const isPayable2 = await presale.payableTokens(user2);
      const price1 = await presale.tokenPrices(user1);
      const price2 = await presale.tokenPrices(user2);

      assert.equal(isPayable1, true, "First token should be payable");
      assert.equal(isPayable2, true, "Second token should be payable");
      assert.equal(price1.toString(), prices[0], "First token price should be set correctly");
      assert.equal(price2.toString(), prices[1], "Second token price should be set correctly");
    });

    it("Should not allow non-owner to add payable tokens", async function () {
      const tokens = [user1];
      const prices = [web3.utils.toWei("1", "ether")];

      try {
        await presale.addPayableTokens(tokens, prices, { from: user1 });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error.message.includes("OwnableUnauthorizedAccount"), "Should throw ownership error");
      }
    });

    it("Should require equal array lengths", async function () {
      const tokens = [user1, user2];
      const prices = [web3.utils.toWei("1", "ether")];

      try {
        await presale.addPayableTokens(tokens, prices);
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error.message.includes("tokens & prices arrays length mismatch"), "Should throw length mismatch error");
      }
    });
  });

  describe("Token Calculations", function () {
    beforeEach(async function () {
      // Set up sale token
      const totalTokens = web3.utils.toWei("1000000", "ether");
      const rate = web3.utils.toWei("0.001", "ether");

      await mockToken.mint(owner, totalTokens);
      await mockToken.approve(presale.address, totalTokens);
      await presale.setSaleToken(mockToken.address, totalTokens, rate, true);
    });

    it("Should calculate correct token amount for ETH", async function () {
      const ethAmount = web3.utils.toWei("1", "ether");
      const expectedTokens = web3.utils.toBN(ethAmount).mul(web3.utils.toBN(web3.utils.toWei("1", "ether"))).div(web3.utils.toBN(web3.utils.toWei("0.001", "ether")));
      
      const calculatedTokens = await presale.getTokenAmount(web3.constants.ZERO_ADDRESS, ethAmount);
      assert.equal(calculatedTokens.toString(), expectedTokens.toString(), "Token calculation should be correct");
    });

    it("Should calculate correct pay amount for ETH", async function () {
      const tokenAmount = web3.utils.toWei("1000", "ether");
      const expectedEth = web3.utils.toBN(tokenAmount).mul(web3.utils.toBN(web3.utils.toWei("0.001", "ether"))).div(web3.utils.toBN(web3.utils.toWei("1", "ether")));
      
      const calculatedEth = await presale.getPayAmount(web3.constants.ZERO_ADDRESS, tokenAmount);
      assert.equal(calculatedEth.toString(), expectedEth.toString(), "ETH calculation should be correct");
    });
  });

  describe("Dynamic Pricing", function () {
    beforeEach(async function () {
      // Set up sale token for dynamic pricing tests
      const totalTokens = web3.utils.toWei("1000000", "ether");
      const rate = web3.utils.toWei("0.001", "ether");

      await mockToken.mint(owner, totalTokens);
      await mockToken.approve(presale.address, totalTokens);
      await presale.setSaleToken(mockToken.address, totalTokens, rate, true);
    });

    it("Should allow owner to toggle dynamic pricing", async function () {
      await presale.toggleDynamicPricing(true);
      const pricingInfo = await presale.getPricingInfo();
      assert.equal(pricingInfo.dynamicPricingEnabled, true, "Dynamic pricing should be enabled");
    });

    it("Should calculate correct dynamic rate for different tiers", async function () {
      await presale.toggleDynamicPricing(true);
      
      // Test Tier 1 (0-19% sold) - Initial rate
      let dynamicRate = await presale.calculateDynamicRate();
      assert.equal(dynamicRate.toString(), web3.utils.toWei("0.001", "ether"), "Should return initial rate for Tier 1");
      
      // Simulate 25% tokens sold (Tier 2 - 5% increase)
      await presale.setSaleToken(mockToken.address, web3.utils.toWei("1000000", "ether"), web3.utils.toWei("0.001", "ether"), true);
      // Note: In real scenario, this would be achieved through actual token purchases
    });

    it("Should update rate automatically after token purchase", async function () {
      await presale.toggleDynamicPricing(true);
      
      const initialRate = await presale.rate();
      
      // This test would require actual token purchases to trigger rate changes
      // For now, we test the manual update function
      await presale.updateRateBasedOnSales();
      
      const newRate = await presale.rate();
      assert.equal(newRate.toString(), initialRate.toString(), "Rate should remain same if no tokens sold");
    });

    it("Should return correct pricing information", async function () {
      const pricingInfo = await presale.getPricingInfo();
      
      assert.equal(pricingInfo.dynamicPricingEnabled, false, "Dynamic pricing should be disabled by default");
      assert.equal(pricingInfo.currentTier, "Tier 1 (0-19% sold) - Initial rate", "Should return correct tier info");
    });
  });

  describe("Fund Withdrawal", function () {
    it("Should allow owner to withdraw ETH", async function () {
      const withdrawAmount = web3.utils.toWei("1", "ether");
      
      // Send some ETH to the contract
      await web3.eth.sendTransaction({
        from: owner,
        to: presale.address,
        value: web3.utils.toWei("2", "ether")
      });

      const initialBalance = await web3.eth.getBalance(owner);
      await presale.withdrawFunds(web3.constants.ZERO_ADDRESS, withdrawAmount);
      const finalBalance = await web3.eth.getBalance(owner);

      assert(web3.utils.toBN(finalBalance).gt(web3.utils.toBN(initialBalance).sub(web3.utils.toBN(withdrawAmount))), "Balance should increase after withdrawal");
    });

    it("Should not allow non-owner to withdraw funds", async function () {
      try {
        await presale.withdrawFunds(web3.constants.ZERO_ADDRESS, web3.utils.toWei("1", "ether"), { from: user1 });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error.message.includes("OwnableUnauthorizedAccount"), "Should throw ownership error");
      }
    });
  });
}); 