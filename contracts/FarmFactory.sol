// SPDX-License-Identifier: MIT

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

    // Replace farms array with mapping
    mapping(bytes32 => Farm) public farms;
    mapping(address => bytes32[]) public farmsByOwner;
    mapping(address => uint256) public ownerFarmCount;
    
    // Keep track of all farm IDs
    bytes32[] public allFarmIds;

    event FarmCreated(
        bytes32 indexed farmId,
        address indexed owner,
        string name,
        uint256 indexed timestamp
    );
    event FarmDeactivated(
        bytes32 indexed farmId,
        uint256 indexed timestamp
    );

    modifier onlyFarmOwner(bytes32 _farmId) {
        require(farms[_farmId].owner == msg.sender, "Not the farm owner");
        _;
    }

    // Helper function to generate farm ID
    function generateFarmId(string memory _name) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_name));
    }

    function createFarm(
        address _token,
        string memory _name,
        uint256 _sizeInAcres,
        uint256 _totalTokenSupply,
        uint256 _valuation,
        uint256 _expectedOutcomePercentage
    ) internal returns (bytes32) {
        require(_token != address(0), "Invalid token address");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_sizeInAcres > 0, "Size must be greater than 0");
        require(_totalTokenSupply > 0, "Total token supply must be greater than 0");
        
        bytes32 farmId = generateFarmId(_name);
        require(farms[farmId].owner == address(0), "Farm name already exists");

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
        
        farms[farmId] = newFarm;
        farmsByOwner[msg.sender].push(farmId);
        allFarmIds.push(farmId);
        ownerFarmCount[msg.sender]++;
        
        emit FarmCreated(farmId, msg.sender, _name, block.timestamp);
        
        return farmId;
    }
    
    function getFarm(bytes32 _farmId) public view returns (Farm memory) {
        require(farms[_farmId].owner != address(0), "Farm does not exist");
        return farms[_farmId];
    }
    
    function deactivateFarm(bytes32 _farmId) public onlyFarmOwner(_farmId) {
        require(farms[_farmId].isActive, "Farm is already inactive");
        farms[_farmId].isActive = false;
        emit FarmDeactivated(_farmId, block.timestamp);
    }
    
    function getTotalFarms() public view returns (uint256) {
        return allFarmIds.length;
    }
    
    function updateFarmValuation(bytes32 _farmId, uint256 _newValuation) public onlyFarmOwner(_farmId) {
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
    ) public returns (bytes32) {
        // Create new farm token
        FarmToken newToken = new FarmToken(
            _tokenName,
            _tokenSymbol,
            _totalTokenSupply,
            allFarmIds.length, // This will be the new farm's ID
            address(this),
            _pricePerToken
        );
        
        // Create farm using existing createFarm function
        bytes32 farmId = createFarm(
            address(newToken),
            _farmName,
            _sizeInAcres,
            _totalTokenSupply,
            _valuation,
            _expectedOutcomePercentage
        );
        
        return farmId;
    }
    
    function getFarmTokenAddress(bytes32 _farmId) public view returns (address) {
        require(farms[_farmId].owner != address(0), "Farm does not exist");
        return farms[_farmId].token;
    }
}

