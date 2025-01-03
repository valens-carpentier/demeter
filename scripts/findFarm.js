const FarmFactory = artifacts.require("FarmFactory");

// Get the deployed FarmFactory address from the network artifacts
module.exports = async function(callback) {
  try {
    // Get the deployed instance directly
    const farmFactory = await FarmFactory.deployed();
    
    // Get total number of farms
    const totalFarms = await farmFactory.getTotalFarms();
    console.log(`Total farms: ${totalFarms}`);
    
    // Iterate through all farms
    for (let i = 0; i < totalFarms; i++) {
      const farm = await farmFactory.getFarm(i);
      if (farm.name === "Ferme du Quennelet") {
        console.log(`Found Ferme du Quennelet!`);
        console.log(`Farm ID: ${i}`);
        console.log(`Token Address: ${farm.token}`);
        console.log(`Owner: ${farm.owner}`);
        console.log(`Size: ${farm.sizeInAcres} acres`);
        console.log(`Total Supply: ${farm.totalTokenSupply}`);
        console.log(`Valuation: ${farm.valuation}`);
        console.log(`Expected Outcome: ${farm.expectedOutcomePercentage}%`);
        break;
      }
    }
  } catch (error) {
    console.error(error);
  }
  callback();
};