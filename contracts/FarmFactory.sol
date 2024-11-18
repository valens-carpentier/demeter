pragma solidity ^0.8.0;

import "./FarmToken.sol";

contract FarmFactory {

    struct Farm {
        address token;        // Address of the farm's token contract
        address owner;        // Wallet address of the farm owner
        string name;         // Name of the farm
        uint256 sizeInAcres; // Physical size of the farm
        uint256 totalTokenSupply; // Total number of tokens for this farm
        uint256 valuation;   // Current value of the farm
        uint256 expectedOutcomePercentage; // Expected return/performance
        bool isActive;       // Whether the farm is currently active
        uint256 timestamp;   // When the farm was created
    }

    Farm[] public farms;

    mapping(address => uint[]) public farmsByOwner;
    mapping(address => uint256) public ownerFarmCount;

    event FarmCreated(uint256 farmId, address owner, string name, uint256 timestamp);
    event FarmDeactivated(uint256 farmId, uint256 timestamp);

    modifier onlyFarmOwner(uint256 _farmId) {
        require(farms[_farmId].owner == msg.sender, "Not the farm owner");
        _;
    }

    function createFarm(
        address _token,
        string memory _name,
        uint256 _sizeInAcres,
        uint256 _totalTokenSupply,
        uint256 _valuation,
        uint256 _expectedOutcomePercentage
    ) internal returns (uint256) {
        require(_token != address(0), "Invalid token address");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_sizeInAcres > 0, "Size must be greater than 0");
        require(_totalTokenSupply > 0, "Total token supply must be greater than 0");
        
        Farm memory newFarm = Farm({
            token: _token,
            owner: msg.sender,
            name: _name,
            sizeInAcres: _sizeInAcres,
            totalTokenSupply: _totalTokenSupply,
            valuation: _valuation,
            expectedOutcomePercentage: _expectedOutcomePercentage,
            isActive: true,
            timestamp: block.timestamp
        });
        
        farms.push(newFarm);
        uint256 newFarmId = farms.length - 1;
        
        farmsByOwner[msg.sender].push(newFarmId);
        ownerFarmCount[msg.sender]++;
        
        emit FarmCreated(newFarmId, msg.sender, _name, block.timestamp);
        
        return newFarmId;
    }
    
    function getFarm(uint256 _farmId) public view returns (Farm memory) {
        require(_farmId < farms.length, "Farm does not exist");
        return farms[_farmId];
    }
    
    function deactivateFarm(uint256 _farmId) public onlyFarmOwner(_farmId) {
        require(farms[_farmId].isActive, "Farm is already inactive");
        farms[_farmId].isActive = false;
        emit FarmDeactivated(_farmId, block.timestamp);
    }
    
    function getTotalFarms() public view returns (uint256) {
        return farms.length;
    }
    
    function updateFarmValuation(uint256 _farmId, uint256 _newValuation) public onlyFarmOwner(_farmId) {
        require(farms[_farmId].isActive, "Farm is inactive");
        farms[_farmId].valuation = _newValuation;
    }
    
    function createFarmWithToken(
        string memory _farmName,
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _sizeInAcres,
        uint256 _totalTokenSupply,
        uint256 _valuation,
        uint256 _expectedOutcomePercentage,
        uint256 _pricePerToken
    ) public returns (uint256) {
        // Create new farm token
        FarmToken newToken = new FarmToken(
            _tokenName,
            _tokenSymbol,
            _totalTokenSupply,
            farms.length, // This will be the new farm's ID
            address(this),
            _pricePerToken
        );
        
        // Create farm using existing createFarm function
        uint256 farmId = createFarm(
            address(newToken),
            _farmName,
            _sizeInAcres,
            _totalTokenSupply,
            _valuation,
            _expectedOutcomePercentage
        );
        
        return farmId;
    }
    
    function getFarmTokenAddress(uint256 _farmId) public view returns (address) {
        require(_farmId < farms.length, "Farm does not exist");
        return farms[_farmId].token;
    }
}

