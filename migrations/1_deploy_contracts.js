const { ethers } = require("hardhat");

async function main() {
  const FarmFactory = await ethers.getContractFactory("FarmFactory");
  const farmFactory = await FarmFactory.deploy();
  await farmFactory.waitForDeployment();

  const address = await farmFactory.getAddress();
  console.log(`FarmFactory deployed to: ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 