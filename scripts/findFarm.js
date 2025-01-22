const hre = require("hardhat");

async function main() {
  try {
    // Get the deployed contract instance
    const FarmFactory = await hre.ethers.getContractFactory("FarmFactory");
    const farmFactory = await FarmFactory.attach("0x3a407FD6F91F51501E08C17091ACbcA0D730A205");
    
    // Get total number of farms
    const totalFarms = await farmFactory.getTotalFarms();
    console.log(`Total farms: ${totalFarms}`);
    
    // Generate the farm ID for the farm we're looking for
    const farmName = "Ferme Lavaqueresse";
    const farmId = await farmFactory.generateFarmId(farmName);
    
    // Get farm details using the farm ID
    const farm = await farmFactory.getFarm(farmId);
    
    console.log(`\nFarm Details:`);
    console.log(`Name: ${farm.name}`);
    console.log(`Token Address: ${farm.token}`);
    console.log(`Owner: ${farm.owner}`);
    console.log(`Size: ${farm.sizeInAcres} acres`);
    console.log(`Total Supply: ${farm.totalTokenSupply}`);
    console.log(`Valuation: ${farm.valuation}`);
    console.log(`Expected Outcome: ${farm.expectedOutcomePercentage}%`);
    console.log(`Is Active: ${farm.isActive}`);
    console.log(`Created At: ${new Date(farm.timestamp * 1000).toLocaleString()}`);
    
  } catch (error) {
    console.error(error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });