const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying FarmFactory...");
  
  const FarmFactory = await ethers.getContractFactory("FarmFactory");
  const farmFactory = await FarmFactory.deploy();
  await farmFactory.waitForDeployment();

  const address = await farmFactory.getAddress();
  console.log(`FarmFactory deployed to: ${address}`);
  
  // Wait for a few block confirmations
  console.log("Waiting for confirmations...");
  await farmFactory.deploymentTransaction().wait(5);
  
  console.log("Deployment completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });