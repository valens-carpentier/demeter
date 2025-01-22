const hre = require("hardhat");

async function main() {
  const FarmFactory = await hre.ethers.getContractFactory("FarmFactory");
  const farmFactory = await FarmFactory.attach("0xE0033bfC105DbD302AE034526D3c67bd9b9C17aB"); // Replace with your deployed factory address
  
  console.log("Creating new farm...");
  
  const tx = await farmFactory.createFarmWithToken(
    "Ferme Lavaqueresse", // _farmName
    "Lavaqueresse Farm Token", // _tokenName
    "LFT", // _tokenSymbol
    250, // _sizeInAcres
    100000, // _totalTokenSupply (100,000 tokens)
    2500000, // _valuation ($2.5M)
    12, // _expectedOutcomePercentage (12%)
    2500 // _pricePerToken ($25.00 = 2500 cents)
  );

  console.log("Transaction sent:", tx.hash);
  const receipt = await tx.wait();
  console.log("Transaction confirmed");

  // Get the farm ID from the event logs
  const farmCreatedLog = receipt.logs.find(
    log => {
      try {
        const decoded = farmFactory.interface.parseLog(log);
        return decoded.name === 'FarmCreated';
      } catch (e) {
        return false;
      }
    }
  );

  if (farmCreatedLog) {
    const decodedLog = farmFactory.interface.parseLog(farmCreatedLog);
    const farmId = decodedLog.args.farmId;
    console.log("New Farm ID:", farmId);

    // Get the farm token address
    const farmTokenAddress = await farmFactory.getFarmTokenAddress(farmId);
    console.log("Farm Token Address:", farmTokenAddress);

    // Additional verification
    const farm = await farmFactory.getFarm(farmId);
    console.log("\nFarm Details:");
    console.log("Name:", farm.name);
    console.log("Token Address:", farm.token);
    console.log("Total Supply:", farm.totalTokenSupply.toString());
    console.log("Valuation:", farm.valuation.toString());
  } else {
    console.error("FarmCreated event not found in logs");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });