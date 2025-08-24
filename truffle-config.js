require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    sepolia: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,
        process.env.SEPOLIA_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID"
      ),
      network_id: 11155111,
      gas: 59900000,
      gasPrice: 50000000000, // 50 gwei - higher priority
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    mainnet: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,
        process.env.MAINNET_URL || "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"
      ),
      network_id: 1,
      gas: 59900000,
      gasPrice: 20000000000, // 20 gwei
      confirmations: 5,
      timeoutBlocks: 200,
      skipDryRun: false,
    },
    
    base: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,
        process.env.BASE_URL || "https://mainnet.base.org"
      ),
      network_id: 8453,
      gas: 59900000,
      gasPrice: 1000000000, // 1 gwei (Base has lower gas)
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    
    baseSepolia: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,
        process.env.BASE_SEPOLIA_URL || "https://sepolia.base.org"
      ),
      network_id: 84532,
      gas: 59900000,
      gasPrice: 1000000000, // 1 gwei
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },

  compilers: {
    solc: {
      version: "0.8.20",
      settings: {
        optimizer: {
          enabled: true,
          runs: 1, // Optimize for deployment cost (fewer runs = smaller bytecode)
          details: {
            yul: true, // Enable Yul optimizer for better bytecode optimization
            yulDetails: {
              optimizerSteps: "u", // Ultra optimization
            },
          },
        },
        evmVersion: "paris", // Use latest EVM version for better optimization
        viaIR: true, // Enable intermediate representation for better optimization
        debug: {
          revertStrings: "strip", // Strip revert strings to reduce contract size
        },
      },
    },
  },

  plugins: ['truffle-plugin-verify'],

  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY,
    basescan: process.env.BASESCAN_API_KEY,
  },
}; 