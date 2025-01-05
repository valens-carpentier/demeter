const FarmFactory = artifacts.require("FarmFactory");

module.exports = async function(callback) {
  try {
    const farmFactory = await FarmFactory.deployed();
    
    const tx = await farmFactory.createFarmWithToken(
        "Ferme Ammeux", // _farmName
        "Ammeux Farm Token", // _tokenName
        "AMMT", // _tokenSymbol
        "450", // _sizeInAcres
        "100000", // _totalTokenSupply 
        "4500000", // _valuation 
        "16", // _expectedOutcomePercentage 
        "45" // _pricePerToken
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