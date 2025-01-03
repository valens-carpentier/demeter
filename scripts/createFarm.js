const FarmFactory = artifacts.require("FarmFactory");

module.exports = async function(callback) {
  try {
    const farmFactory = await FarmFactory.deployed();
    
    const tx = await farmFactory.createFarmWithToken(
        "Ferme du Quennelet", // _farmName
        "Quennelet Farm Token", // _tokenName
        "QFT", // _tokenSymbol
        "122", // _sizeInAcres
        "100000", // _totalTokenSupply 
        "1000000", // _valuation 
        "10", // _expectedOutcomePercentage 
        "1" // _pricePerToken
    );
    
    console.log("Farm created! Transaction:", tx.tx);
    console.log("Gas used:", tx.receipt.gasUsed);
    
    // Get the farm ID from the event
    const farmCreatedEvent = tx.logs.find(log => log.event === 'FarmCreated');
    console.log("New Farm ID:", farmCreatedEvent.args.farmId.toString());
    
  } catch (error) {
    console.error(error);
  }
  callback();
};