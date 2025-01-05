const FarmFactory = artifacts.require("FarmFactory");

module.exports = async function(callback) {
  try {
    // Get the deployed FarmFactory
    const farmFactory = await FarmFactory.deployed();
    
    // Deactivate farm with ID 0
    const tx = await farmFactory.deactivateFarm(0);
    
    console.log("Farm deactivated successfully!");
    console.log("Transaction:", tx.tx);
    
    // Get the deactivation event details
    const farmDeactivatedEvent = tx.logs.find(log => log.event === 'FarmDeactivated');
    console.log("Deactivated Farm ID:", farmDeactivatedEvent.args.farmId.toString());
    console.log("Timestamp:", farmDeactivatedEvent.args.timestamp.toString());
    
  } catch (error) {
    console.error(error);
  }
  callback();
};