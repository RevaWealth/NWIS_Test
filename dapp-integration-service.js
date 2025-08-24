/**
 * NexusWealth PreSale Dapp Integration Service
 * This service handles all interactions with the deployed smart contracts
 */

import { ethers } from 'ethers';
import contractConfig from './contract-config.js';

class NexusWealthPresaleService {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.presaleContract = null;
        this.nwisTokenContract = null;
        this.isConnected = false;
        this.currentAccount = null;
        this.currentNetwork = null;
    }

    // ============================================================================
    // WALLET CONNECTION & NETWORK MANAGEMENT
    // ============================================================================

    async connectWallet() {
        try {
            if (typeof window.ethereum === 'undefined') {
                throw new Error('MetaMask or other wallet not found. Please install MetaMask.');
            }

            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.currentAccount = accounts[0];
            
            // Create provider and signer
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.signer = this.provider.getSigner();
            
            // Check network
            const network = await this.provider.getNetwork();
            this.currentNetwork = network;
            
            if (network.chainId !== contractConfig.CONTRACT_ADDRESSES.NETWORK_ID) {
                await this.switchToSepolia();
            }
            
            // Initialize contracts
            await this.initializeContracts();
            
            // Listen for account changes
            window.ethereum.on('accountsChanged', this.handleAccountChange.bind(this));
            window.ethereum.on('chainChanged', this.handleChainChange.bind(this));
            
            this.isConnected = true;
            
            return {
                success: true,
                account: this.currentAccount,
                network: this.currentNetwork
            };
            
        } catch (error) {
            console.error('Wallet connection failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async switchToSepolia() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: contractConfig.NETWORK_CONFIG.sepolia.chainId }]
            });
            
            // Refresh provider after network switch
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.signer = this.provider.getSigner();
            
            return { success: true, message: 'Switched to Sepolia testnet' };
        } catch (error) {
            if (error.code === 4902) {
                // Chain not added, add it
                return await this.addSepoliaNetwork();
            }
            throw error;
        }
    }

    async addSepoliaNetwork() {
        try {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [contractConfig.NETWORK_CONFIG.sepolia]
            });
            return { success: true, message: 'Sepolia testnet added successfully' };
        } catch (error) {
            throw new Error('Failed to add Sepolia network: ' + error.message);
        }
    }

    async initializeContracts() {
        try {
            this.presaleContract = new ethers.Contract(
                contractConfig.CONTRACT_ADDRESSES.PRESALE_CONTRACT,
                contractConfig.PRESALE_CONTRACT_ABI,
                this.signer
            );
            
            this.nwisTokenContract = new ethers.Contract(
                contractConfig.CONTRACT_ADDRESSES.NWIS_TOKEN,
                contractConfig.NWIS_TOKEN_ABI,
                this.signer
            );
            
            return { success: true, message: 'Contracts initialized successfully' };
        } catch (error) {
            throw new Error('Failed to initialize contracts: ' + error.message);
        }
    }

    // ============================================================================
    // CONTRACT STATE QUERIES
    // ============================================================================

    async getPresaleStatus() {
        try {
            const [
                saleStatus,
                saleToken,
                totalTokens,
                soldTokens,
                remainingTokens
            ] = await Promise.all([
                this.presaleContract.saleStatus(),
                this.presaleContract.getSaleToken(),
                this.presaleContract.getTotalTokensForSale(),
                this.presaleContract.getSoldTokens(),
                this.presaleContract.getRemainingTokens()
            ]);

            return {
                isActive: saleStatus,
                saleToken: saleToken,
                totalTokens: contractConfig.formatTokenAmount(totalTokens),
                soldTokens: contractConfig.formatTokenAmount(soldTokens),
                remainingTokens: contractConfig.formatTokenAmount(remainingTokens),
                progress: (soldTokens / totalTokens * 100).toFixed(2)
            };
        } catch (error) {
            console.error('Failed to get presale status:', error);
            throw error;
        }
    }

    async getUserInfo() {
        try {
            const [balance, allowance, purchaseHistory] = await Promise.all([
                this.nwisTokenContract.balanceOf(this.currentAccount),
                this.nwisTokenContract.allowance(this.currentAccount, contractConfig.CONTRACT_ADDRESSES.PRESALE_CONTRACT),
                this.presaleContract.getUserPurchaseHistory(this.currentAccount)
            ]);

            return {
                nwisBalance: contractConfig.formatTokenAmount(balance),
                allowance: contractConfig.formatTokenAmount(allowance),
                totalPurchased: contractConfig.formatTokenAmount(purchaseHistory.totalPurchased),
                totalSpent: contractConfig.formatEthAmount(purchaseHistory.totalSpent)
            };
        } catch (error) {
            console.error('Failed to get user info:', error);
            throw error;
        }
    }

    async getPurchaseLimits() {
        try {
            const [minPurchase, maxPurchase] = await this.presaleContract.getPurchaseLimits();
            
            return {
                minPurchase: contractConfig.formatEthAmount(minPurchase),
                maxPurchase: contractConfig.formatEthAmount(maxPurchase)
            };
        } catch (error) {
            console.error('Failed to get purchase limits:', error);
            throw error;
        }
    }

    // ============================================================================
    // PRICE MANAGEMENT
    // ============================================================================

    async getEthPrice() {
        try {
            // Try CoinGecko first (free)
            const response = await fetch(contractConfig.PRICING_CONFIG.PRICE_SOURCES.COINGECKO);
            const data = await response.json();
            const ethPrice = data.ethereum.usd;
            
            // Convert to smallest units (6 decimals) as expected by contract
            return Math.floor(ethPrice * 1e6);
        } catch (error) {
            console.error('Failed to fetch ETH price from CoinGecko:', error);
            
            // Fallback to default price
            return Math.floor(contractConfig.PRICING_CONFIG.DEFAULT_ETH_PRICE * 1e6);
        }
    }

    async getBackendPriceSignature(ethPrice) {
        try {
            // This would typically come from your backend
            // For now, we'll use a mock signature
            const mockSignature = ethers.utils.randomBytes(65);
            return mockSignature;
        } catch (error) {
            console.error('Failed to get backend signature:', error);
            throw error;
        }
    }

    // ============================================================================
    // PURCHASE PREVIEW & EXECUTION
    // ============================================================================

    async previewPurchase(ethAmount) {
        try {
            const ethPrice = await this.getEthPrice();
            const ethAmountWei = contractConfig.parseEthAmount(ethAmount);
            
            const [tokensToReceive, usdValue] = await this.presaleContract.previewEthPurchase(
                ethAmountWei,
                ethPrice
            );

            return {
                ethAmount: ethAmount,
                ethPrice: ethPrice / 1e6, // Convert back to USD
                tokensToReceive: contractConfig.formatTokenAmount(tokensToReceive),
                usdValue: usdValue / 1e6, // Convert back to USD
                estimatedGas: await this.estimatePurchaseGas(ethAmountWei, ethPrice)
            };
        } catch (error) {
            console.error('Failed to preview purchase:', error);
            throw error;
        }
    }

    async executePurchase(ethAmount) {
        try {
            const ethPrice = await this.getEthPrice();
            const signature = await this.getBackendPriceSignature(ethPrice);
            const ethAmountWei = contractConfig.parseEthAmount(ethAmount);
            
            // Validate purchase amount
            const limits = await this.getPurchaseLimits();
            if (ethAmount < parseFloat(limits.minPurchase)) {
                throw new Error(`Purchase amount must be at least ${limits.minPurchase} ETH`);
            }
            if (ethAmount > parseFloat(limits.maxPurchase)) {
                throw new Error(`Purchase amount cannot exceed ${limits.maxPurchase} ETH`);
            }

            // Execute purchase
            const tx = await this.presaleContract.buyTokenWithEthPrice(
                ethAmountWei,
                ethPrice,
                signature,
                { value: ethAmountWei }
            );

            return {
                success: true,
                transactionHash: tx.hash,
                message: 'Purchase transaction submitted successfully'
            };
        } catch (error) {
            console.error('Purchase failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async estimatePurchaseGas(ethAmountWei, ethPrice) {
        try {
            const signature = await this.getBackendPriceSignature(ethPrice);
            const gasEstimate = await this.presaleContract.estimateGas.buyTokenWithEthPrice(
                ethAmountWei,
                ethPrice,
                signature,
                { value: ethAmountWei }
            );
            
            return gasEstimate.toString();
        } catch (error) {
            console.error('Failed to estimate gas:', error);
            return '0';
        }
    }

    // ============================================================================
    // TOKEN APPROVAL
    // ============================================================================

    async approveTokens(amount) {
        try {
            const amountWei = contractConfig.parseTokenAmount(amount);
            
            const tx = await this.nwisTokenContract.approve(
                contractConfig.CONTRACT_ADDRESSES.PRESALE_CONTRACT,
                amountWei
            );

            return {
                success: true,
                transactionHash: tx.hash,
                message: 'Token approval submitted successfully'
            };
        } catch (error) {
            console.error('Token approval failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ============================================================================
    // EVENT HANDLERS
    // ============================================================================

    handleAccountChange(accounts) {
        if (accounts.length === 0) {
            // User disconnected wallet
            this.isConnected = false;
            this.currentAccount = null;
            this.presaleContract = null;
            this.nwisTokenContract = null;
        } else {
            // User switched accounts
            this.currentAccount = accounts[0];
            this.initializeContracts();
        }
    }

    handleChainChange(chainId) {
        if (chainId !== contractConfig.CONTRACT_ADDRESSES.NETWORK_ID) {
            // User switched to different network
            this.isConnected = false;
            alert('Please switch to Sepolia testnet to use this dapp');
        }
    }

    // ============================================================================
    // UTILITY METHODS
    // ============================================================================

    disconnect() {
        this.isConnected = false;
        this.currentAccount = null;
        this.presaleContract = null;
        this.nwisTokenContract = null;
        this.provider = null;
        this.signer = null;
    }

    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            account: this.currentAccount,
            network: this.currentNetwork,
            contractsInitialized: !!(this.presaleContract && this.nwisTokenContract)
        };
    }
}

// Export the service
export default NexusWealthPresaleService;
