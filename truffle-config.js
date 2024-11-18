require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    base_sepolia: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,
        'https://sepolia.base.org'
      ),
      network_id: 84532,     // Base Sepolia's network ID
      chain_id: 84532,       // Base Sepolia's chain ID
      gas: 5000000,
      gasPrice: 1000000000,  // 1 gwei
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  compilers: {
    solc: {
      version: "0.8.20",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
}; 