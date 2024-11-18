pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FarmToken is ERC20, Ownable {
    uint256 public farmId;
    address public farmFactory;
    uint256 public pricePerToken;
    
    event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost);
    event PriceUpdated(uint256 oldPrice, uint256 newPrice);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 _totalSupply,
        uint256 _farmId,
        address _farmFactory,
        uint256 _pricePerToken
    ) ERC20(name, symbol) {
        farmId = _farmId;
        farmFactory = _farmFactory;
        pricePerToken = _pricePerToken;
        _mint(msg.sender, _totalSupply);
    }
    
    function buyTokens(uint256 amount) public payable {
        require(amount > 0, "Amount must be greater than 0");
        
        uint256 totalCost = amount * pricePerToken;
        
        require(msg.value >= totalCost, "Insufficient payment");
        require(balanceOf(owner()) >= amount, "Insufficient tokens available");
        
        _transfer(owner(), msg.sender, amount);
        emit TokensPurchased(msg.sender, amount, totalCost);
        
        uint256 excess = msg.value - totalCost;
        if(excess > 0) {
            (bool success, ) = payable(msg.sender).call{value: excess}("");
            require(success, "Failed to return excess payment");
        }
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
} 