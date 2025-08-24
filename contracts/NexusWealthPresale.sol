// SPDX-License-Identifier: MIT
/*
 NexusWealth Investment Solution - Presale Contract
*/

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract NexusWealthPresale is Ownable, ReentrancyGuard, Pausable {
    // Events
    event TokensPurchased(address indexed buyer, uint256 amount, uint256 tokensReceived);
    event SaleStatusChanged(bool isActive);
    event PriceUpdated(uint256 newPrice);
    event TokensWithdrawn(address indexed recipient, uint256 amount);
    event EmergencyWithdraw(address indexed recipient, uint256 amount);

    // Token contract
    IERC20 public immutable token;
    
    // Sale parameters
    uint256 public tokenPrice; // Price in wei per token
    uint256 public totalTokensForSale;
    uint256 public totalTokensSold;
    uint256 public minPurchase;
    uint256 public maxPurchase;
    
    // Sale status
    bool public saleActive;
    uint256 public saleStartTime;
    uint256 public saleEndTime;
    
    // Purchase tracking
    mapping(address => uint256) public userPurchases;
    
    // Treasury addresses
    address public treasuryAddress;
    address public devAddress;
    
    constructor(
        address _token,
        address _treasury,
        address _dev,
        uint256 _tokenPrice,
        uint256 _totalTokensForSale,
        uint256 _minPurchase,
        uint256 _maxPurchase
    ) Ownable(msg.sender) {
        require(_token != address(0), "Invalid token address");
        require(_treasury != address(0), "Invalid treasury address");
        require(_dev != address(0), "Invalid dev address");
        require(_tokenPrice > 0, "Token price must be greater than 0");
        require(_totalTokensForSale > 0, "Total tokens must be greater than 0");
        require(_minPurchase > 0, "Min purchase must be greater than 0");
        require(_maxPurchase >= _minPurchase, "Max purchase must be >= min purchase");
        
        token = IERC20(_token);
        treasuryAddress = _treasury;
        devAddress = _dev;
        tokenPrice = _tokenPrice;
        totalTokensForSale = _totalTokensForSale;
        minPurchase = _minPurchase;
        maxPurchase = _maxPurchase;
    }
    
    // Modifiers
    modifier isSaleActive() {
        require(saleActive, "Sale is not active");
        require(block.timestamp >= saleStartTime, "Sale has not started");
        require(block.timestamp <= saleEndTime, "Sale has ended");
        _;
    }
    
    // Purchase functions
    function purchaseTokens() external payable nonReentrant whenNotPaused isSaleActive {
        require(msg.value >= minPurchase, "Amount below minimum purchase");
        require(msg.value <= maxPurchase, "Amount exceeds maximum purchase");
        require(userPurchases[msg.sender] + msg.value <= maxPurchase, "Total purchase exceeds maximum");
        
        uint256 tokensToReceive = (msg.value * 1e18) / tokenPrice;
        require(totalTokensSold + tokensToReceive <= totalTokensForSale, "Insufficient tokens available");
        
        // Update state
        totalTokensSold += tokensToReceive;
        userPurchases[msg.sender] += msg.value;
        
        // Transfer tokens to buyer immediately
        require(token.transferFrom(owner(), msg.sender, tokensToReceive), "Token transfer failed");
        
        emit TokensPurchased(msg.sender, msg.value, tokensToReceive);
    }
    
    // Admin functions
    function setSaleStatus(bool _active) external onlyOwner {
        saleActive = _active;
        if (_active && saleStartTime == 0) {
            saleStartTime = block.timestamp;
        }
        emit SaleStatusChanged(_active);
    }
    
    function setSaleEndTime(uint256 _endTime) external onlyOwner {
        require(_endTime > block.timestamp, "End time must be in the future");
        saleEndTime = _endTime;
    }
    
    function setTokenPrice(uint256 _newPrice) external onlyOwner {
        require(_newPrice > 0, "Price must be greater than 0");
        tokenPrice = _newPrice;
        emit PriceUpdated(_newPrice);
    }
    
    function setPurchaseLimits(uint256 _minPurchase, uint256 _maxPurchase) external onlyOwner {
        require(_minPurchase > 0, "Min purchase must be greater than 0");
        require(_maxPurchase >= _minPurchase, "Max purchase must be >= min purchase");
        minPurchase = _minPurchase;
        maxPurchase = _maxPurchase;
    }
    
    function setTreasuryAddress(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury address");
        treasuryAddress = _treasury;
    }
    
    function setDevAddress(address _dev) external onlyOwner {
        require(_dev != address(0), "Invalid dev address");
        devAddress = _dev;
    }
    
    // Withdrawal functions
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        
        // Split between treasury and dev
        uint256 treasuryAmount = (balance * 80) / 100; // 80% to treasury
        uint256 devAmount = balance - treasuryAmount; // 20% to dev
        
        (bool treasurySuccess, ) = treasuryAddress.call{value: treasuryAmount}("");
        require(treasurySuccess, "Treasury transfer failed");
        
        (bool devSuccess, ) = devAddress.call{value: devAmount}("");
        require(devSuccess, "Dev transfer failed");
    }
    
    function withdrawTokens() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        
        require(token.transfer(owner(), balance), "Token transfer failed");
        emit TokensWithdrawn(owner(), balance);
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 ethBalance = address(this).balance;
        uint256 tokenBalance = token.balanceOf(address(this));
        
        if (ethBalance > 0) {
            (bool success, ) = owner().call{value: ethBalance}("");
            require(success, "ETH transfer failed");
        }
        
        if (tokenBalance > 0) {
            require(token.transfer(owner(), tokenBalance), "Token transfer failed");
        }
        
        emit EmergencyWithdraw(owner(), ethBalance + tokenBalance);
    }
    
    // Pause/Unpause
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // View functions
    function getSaleInfo() external view returns (
        bool _saleActive,
        uint256 _tokenPrice,
        uint256 _totalTokensForSale,
        uint256 _totalTokensSold,
        uint256 _minPurchase,
        uint256 _maxPurchase,
        uint256 _saleStartTime,
        uint256 _saleEndTime
    ) {
        return (
            saleActive,
            tokenPrice,
            totalTokensForSale,
            totalTokensSold,
            minPurchase,
            maxPurchase,
            saleStartTime,
            saleEndTime
        );
    }
    
    function getUserInfo(address user) external view returns (
        uint256 _purchased,
        uint256 _tokensPurchased
    ) {
        uint256 purchased = userPurchases[user];
        uint256 tokensPurchased = purchased > 0 ? (purchased * 1e18) / tokenPrice : 0;
        
        return (purchased, tokensPurchased);
    }
    
    // Receive function
    receive() external payable {
        revert("Use purchaseTokens() function");
    }
}
