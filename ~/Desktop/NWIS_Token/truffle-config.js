require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      gas: 100000000,
      gasPrice: 2000000000,
    },
    
    sepolia: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,
        process.env.SEPOLIA_URL
      ),
      network_id: 11155111,
      gas: 59900000,
      gasPrice: 50000000000, // 50 gwei
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    
    mainnet: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,
        process.env.MAINNET_URL
      ),
      network_id: 1,
      gas: 59900000,
      gasPrice: 20000000000, // 20 gwei
      confirmations: 5,
      timeoutBlocks: 200,
      skipDryRun: false,
    }
  },

  compilers: {
    solc: {
      version: "0.8.20",
      settings: {
        optimizer: {
          enabled: true,
          runs: 1, // Optimize for deployment cost
          details: {
            yul: true, // Enable Yul optimizer
            yulDetails: {
              optimizerSteps: "u", // Ultra optimization
            },
          },
        },
        evmVersion: "paris", // Latest EVM version
        viaIR: true, // Enable intermediate representation
        debug: {
          revertStrings: "strip", // Strip revert strings
        },
      },
    },
  },

  plugins: ['truffle-plugin-verify'],

  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY,
  },
};


