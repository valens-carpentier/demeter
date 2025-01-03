const FarmFactory = artifacts.require("FarmFactory");

module.exports = async function(deployer) {
  // Deploy FarmFactory
  await deployer.deploy(FarmFactory);
  const farmFactory = await FarmFactory.deployed();
  
  // After deployment, you can create a farm with its token using createFarmWithToken
  await farmFactory.createFarmWithToken(
    "Ferme du Quennelet", // _farmName
    "Quennelet Farm Token", // _tokenName
    "QFT", // _tokenSymbol
    "122", // _sizeInAcres
    "100000", // _totalTokenSupply 
    "1000000", // _valuation 
    "10", // _expectedOutcomePercentage 
    "1" // _pricePerToken
  );
}; 