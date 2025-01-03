const FarmFactory = artifacts.require("FarmFactory");
const FarmToken = artifacts.require("FarmToken");

module.exports = async function(callback) {
  try {
    const farmId = process.argv[4]; // Pass farmId as script parameter
    const tokensAmount = process.argv[5]; // Pass amount as script parameter

    // Get user's address
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];

    // Get the farm factory
    const farmFactory = await FarmFactory.deployed();

    // Get farm token address
    const farmTokenAddress = await farmFactory.getFarmTokenAddress(farmId);

    // Get FarmToken instance
    const farmToken = await FarmToken.at(farmTokenAddress);

    // Get token price
    const pricePerToken = await farmToken.pricePerToken();

    // Calculate total cost
    const totalCost = pricePerToken * tokensAmount;

    // Get owner's token balance (since we're buying from the owner)
    const ownerAddress = await farmToken.owner();
    const ownerBalance = await farmToken.balanceOf(ownerAddress);

    // Check if owner has enough tokens
    if (ownerBalance < tokensAmount) {
      throw new Error("Insufficient tokens available for purchase");
    }

    // User buys tokens
    const tx = await farmToken.buyTokens(tokensAmount, {
      value: totalCost,
      from: userAddress
    });

    console.log("Tokens purchased successfully!");
    console.log("Transaction:", tx.tx);
    console.log("Gas used:", tx.receipt.gasUsed);

    // Get user's new balance
    const newBalance = await farmToken.balanceOf(userAddress);
    console.log("New balance:", newBalance.toString());

    // Get purchase event
    const purchaseEvent = tx.logs.find(log => log.event === 'TokensPurchased');
    console.log("Amount purchased:", purchaseEvent.args.amount.toString());
    console.log("Cost paid:", purchaseEvent.args.cost.toString());

  } catch (error) {
    console.error(error);
  }
  callback();
};