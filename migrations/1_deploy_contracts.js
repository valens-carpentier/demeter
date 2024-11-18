const FarmFactory = artifacts.require("FarmFactory");

module.exports = async function(deployer) {
  // Deploy FarmFactory
  await deployer.deploy(FarmFactory);
  const farmFactory = await FarmFactory.deployed();
  
  // After deployment, you can create a farm with its token using createFarmWithToken
  await farmFactory.createFarmWithToken(
    "My Farm", // _farmName
    "Farm Token", // _tokenName
    "FARM", // _tokenSymbol
    "100", // _sizeInAcres
    "1000000000000000000000000", // _totalTokenSupply (1 million tokens with 18 decimals)
    "1000000000000000000000", // _valuation (1000 ETH in wei)
    "10", // _expectedOutcomePercentage (10%)
    "1000000000000000000" // _pricePerToken (1 ETH in wei)
  );
}; 