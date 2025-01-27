// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IAggregatorV3.sol";
import "./interfaces/IUSDC.sol";

contract FarmToken is ERC20, Ownable {
    uint256 public farmId;
    address public farmFactory;
    uint256 public pricePerToken; // Price in USD cents (4500 = $45.00)
    
    // Chainlink ETH/USD Price Feed address for Base Sepolia
    address public constant ETH_USD_PRICE_FEED = 0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1;
    
    // Safety margin for price fluctuations (5%)
    uint256 public constant PRICE_SAFETY_MARGIN = 5;
    
    // Price validity duration (1 hour)
    uint256 public constant PRICE_VALIDITY_DURATION = 1 hours;
    
    // Add USDC contract address for Base Sepolia
    address public constant USDC_ADDRESS = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
    
    // Add payment method enum
    enum PaymentMethod { ETH, USDC }
    
    event TokensPurchased(address indexed buyer, uint256 amount, uint256 costInWei, uint256 costInUsd);
    event PriceUpdated(uint256 oldPrice, uint256 newPrice);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    event TokensSold(address indexed seller, uint256 amount, uint256 costInWei, uint256 costInUsd);
    event TokensPurchasedWithUSDC(address indexed buyer, uint256 amount, uint256 usdcAmount);
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 _totalSupply,
        uint256 _farmId,
        address _farmFactory,
        uint256 _pricePerToken
    ) ERC20(name, symbol) Ownable(msg.sender) {
        farmId = _farmId;
        farmFactory = _farmFactory;
        pricePerToken = _pricePerToken;
        _mint(msg.sender, _totalSupply * 10**decimals());
    }
    
    function getLatestETHPrice() public view returns (uint256, uint256) {
        (, int256 price, , uint256 updatedAt, ) = IAggregatorV3(ETH_USD_PRICE_FEED).latestRoundData();
        require(price > 0, "Invalid ETH price");
        require(block.timestamp - updatedAt <= PRICE_VALIDITY_DURATION, "Stale price data");
        return (uint256(price), updatedAt);
    }
    
    function calculateETHAmount(uint256 usdCents) public view returns (uint256) {
        (uint256 ethPrice, ) = getLatestETHPrice();
        
        // ETH price is in USD with 8 decimals, convert to cents
        uint256 ethPriceInCents = ethPrice * 100 / 1e8;
        
        // Add safety margin
        uint256 ethPriceWithMargin = ethPriceInCents * (100 + PRICE_SAFETY_MARGIN) / 100;
        
        // Calculate ETH amount in wei (1 ETH = 1e18 wei)
        return (usdCents * 1e18) / ethPriceWithMargin;
    }
    
    function buyTokens(uint256 amount) public payable {
        require(amount > 0, "Amount must be greater than 0");
        
        uint256 actualAmount = amount * 10**decimals();
        uint256 totalCostInUsd = amount * pricePerToken; // in cents
        uint256 totalCostInWei = calculateETHAmount(totalCostInUsd);
        
        require(msg.value >= totalCostInWei, "Insufficient payment");
        require(balanceOf(owner()) >= actualAmount, "Insufficient tokens available");
        
        _transfer(owner(), msg.sender, actualAmount);
        emit TokensPurchased(msg.sender, amount, totalCostInWei, totalCostInUsd);
        
        uint256 excess = msg.value - totalCostInWei;
        if(excess > 0) {
            (bool success, ) = payable(msg.sender).call{value: excess}("");
            require(success, "Failed to return excess payment");
        }
    }
    
    function sellTokens(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount * 10**decimals(), "Insufficient token balance");
        
        uint256 actualAmount = amount * 10**decimals();
        uint256 totalValueInUsd = amount * pricePerToken; // in cents
        uint256 totalValueInWei = calculateETHAmount(totalValueInUsd);
        
        require(address(this).balance >= totalValueInWei, "Insufficient contract balance");
        
        // Transfer tokens back to owner
        _transfer(msg.sender, owner(), actualAmount);
        
        // Transfer ETH to seller
        (bool success, ) = payable(msg.sender).call{value: totalValueInWei}("");
        require(success, "Failed to send ETH to seller");
        
        emit TokensSold(msg.sender, amount, totalValueInWei, totalValueInUsd);
    }
    
    modifier onlyFarmFactory() {
        require(msg.sender == farmFactory, "Caller is not the farm factory");
        _;
    }
    
    function updatePrice(uint256 newPrice) public onlyFarmFactory {
        uint256 oldPrice = pricePerToken;
        pricePerToken = newPrice;
        emit PriceUpdated(oldPrice, newPrice);
    }
    
    function withdrawFunds() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Failed to withdraw funds");
        emit FundsWithdrawn(owner(), balance);
    }
    
    // Add buyTokensWithUSDC function
    function buyTokensWithUSDC(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        
        uint256 actualAmount = amount * 10**decimals();
        uint256 totalCostInUsd = amount * pricePerToken; // in cents
        
        // Convert cents to USDC (USDC has 6 decimals)
        uint256 usdcAmount = (totalCostInUsd * 10**4); // Convert cents to USDC decimals (6)
        
        IUSDC usdc = IUSDC(USDC_ADDRESS);
        
        // Check USDC allowance
        require(usdc.allowance(msg.sender, address(this)) >= usdcAmount, 
                "Insufficient USDC allowance");
        
        // Check USDC balance
        require(usdc.balanceOf(msg.sender) >= usdcAmount, 
                "Insufficient USDC balance");
        
        // Check token availability
        require(balanceOf(owner()) >= actualAmount, 
                "Insufficient tokens available");
        
        // Transfer USDC from buyer to contract
        require(usdc.transferFrom(msg.sender, address(this), usdcAmount),
                "USDC transfer failed");
        
        // Transfer tokens to buyer
        _transfer(owner(), msg.sender, actualAmount);
        
        emit TokensPurchasedWithUSDC(msg.sender, amount, usdcAmount);
    }
    
    // Add function to withdraw USDC (for owner)
    function withdrawUSDC() public onlyOwner {
        IUSDC usdc = IUSDC(USDC_ADDRESS);
        uint256 balance = usdc.balanceOf(address(this));
        require(balance > 0, "No USDC to withdraw");
        
        require(usdc.transfer(owner(), balance), "USDC transfer failed");
    }
} 