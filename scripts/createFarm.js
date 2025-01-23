const hre = require("hardhat");

async function main() {
  const FarmFactory = await hre.ethers.getContractFactory("FarmFactory");
  const farmFactory = await FarmFactory.attach("0xD62630EbBbfF334a9B6c18c8915D2b4547b47bbD"); // Replace with your deployed factory address
  
  console.log("Creating new farm...");
  
  // Convert numbers to BigInt where needed
  const tx = await farmFactory.createFarmWithToken(
    "Ferme Du Quennelet", // farmName
    "Quennelet Farm Token", // tokenName
    "QFT", // tokenSymbol
    BigInt(120), // sizeInAcres
    BigInt(120000), // totalTokenSupply
    BigInt(1200000), // valuation
    BigInt(16), // expectedOutcomePercentage
    BigInt(1200) // pricePerToken (in cents)
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