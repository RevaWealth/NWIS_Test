/**
 * React Hook for NexusWealth PreSale Integration
 * This hook provides easy access to all presale functionality
 */

import { useState, useEffect, useCallback } from 'react';
import NexusWealthPresaleService from './dapp-integration-service.js';

export const useNexusWealthPresale = () => {
    const [service] = useState(() => new NexusWealthPresaleService());
    const [connectionStatus, setConnectionStatus] = useState({
        isConnected: false,
        account: null,
        network: null,
        contractsInitialized: false
    });
    
    const [presaleStatus, setPresaleStatus] = useState({
        isActive: false,
        saleToken: null,
        totalTokens: '0',
        soldTokens: '0',
        remainingTokens: '0',
        progress: '0'
    });
    
    const [userInfo, setUserInfo] = useState({
        nwisBalance: '0',
        allowance: '0',
        totalPurchased: '0',
        totalSpent: '0'
    });
    
    const [purchaseLimits, setPurchaseLimits] = useState({
        minPurchase: '0',
        maxPurchase: '0'
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ============================================================================
    // WALLET CONNECTION
    // ============================================================================

    const connectWallet = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await service.connectWallet();
            
            if (result.success) {
                setConnectionStatus(service.getConnectionStatus());
                await refreshAllData();
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [service]);

    const disconnectWallet = useCallback(() => {
        service.disconnect();
        setConnectionStatus({
            isConnected: false,
            account: null,
            network: null,
            contractsInitialized: false
        });
        setPresaleStatus({
            isActive: false,
            saleToken: null,
            totalTokens: '0',
            soldTokens: '0',
            remainingTokens: '0',
            progress: '0'
        });
        setUserInfo({
            nwisBalance: '0',
            allowance: '0',
            totalPurchased: '0',
            totalSpent: '0'
        });
    }, [service]);

    // ============================================================================
    // DATA REFRESHING
    // ============================================================================

    const refreshPresaleStatus = useCallback(async () => {
        if (!service.isConnected) return;
        
        try {
            const status = await service.getPresaleStatus();
            setPresaleStatus(status);
        } catch (err) {
            console.error('Failed to refresh presale status:', err);
        }
    }, [service]);

    const refreshUserInfo = useCallback(async () => {
        if (!service.isConnected) return;
        
        try {
            const info = await service.getUserInfo();
            setUserInfo(info);
        } catch (err) {
            console.error('Failed to refresh user info:', err);
        }
    }, [service]);

    const refreshPurchaseLimits = useCallback(async () => {
        if (!service.isConnected) return;
        
        try {
            const limits = await service.getPurchaseLimits();
            setPurchaseLimits(limits);
        } catch (err) {
            console.error('Failed to refresh purchase limits:', err);
        }
    }, [service]);

    const refreshAllData = useCallback(async () => {
        await Promise.all([
            refreshPresaleStatus(),
            refreshUserInfo(),
            refreshPurchaseLimits()
        ]);
    }, [refreshPresaleStatus, refreshUserInfo, refreshPurchaseLimits]);

    // ============================================================================
    // PURCHASE OPERATIONS
    // ============================================================================

    const previewPurchase = useCallback(async (ethAmount) => {
        if (!service.isConnected) {
            throw new Error('Wallet not connected');
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const preview = await service.previewPurchase(ethAmount);
            return preview;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [service]);

    const executePurchase = useCallback(async (ethAmount) => {
        if (!service.isConnected) {
            throw new Error('Wallet not connected');
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const result = await service.executePurchase(ethAmount);
            
            if (result.success) {
                // Refresh data after successful purchase
                await refreshAllData();
            }
            
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [service, refreshAllData]);

    // ============================================================================
    // TOKEN APPROVAL
    // ============================================================================

    const approveTokens = useCallback(async (amount) => {
        if (!service.isConnected) {
            throw new Error('Wallet not connected');
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const result = await service.approveTokens(amount);
            
            if (result.success) {
                // Refresh user info after approval
                await refreshUserInfo();
            }
            
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [service, refreshUserInfo]);

    // ============================================================================
    // NETWORK MANAGEMENT
    // ============================================================================

    const switchToSepolia = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await service.switchToSepolia();
            if (result.success) {
                setConnectionStatus(service.getConnectionStatus());
            }
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [service]);

    // ============================================================================
    // EFFECTS
    // ============================================================================

    useEffect(() => {
        // Set up event listeners for wallet changes
        const handleAccountChange = () => {
            setConnectionStatus(service.getConnectionStatus());
        };

        const handleChainChange = () => {
            setConnectionStatus(service.getConnectionStatus());
        };

        // Add listeners if service is available
        if (service && typeof window !== 'undefined' && window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountChange);
            window.ethereum.on('chainChanged', handleChainChange);
        }

        return () => {
            if (typeof window !== 'undefined' && window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountChange);
                window.ethereum.removeListener('chainChanged', handleChainChange);
            }
        };
    }, [service]);

    // Auto-refresh data when connected
    useEffect(() => {
        if (connectionStatus.isConnected && connectionStatus.contractsInitialized) {
            refreshAllData();
            
            // Set up periodic refresh
            const interval = setInterval(refreshAllData, 30000); // Every 30 seconds
            
            return () => clearInterval(interval);
        }
    }, [connectionStatus.isConnected, connectionStatus.contractsInitialized, refreshAllData]);

    // ============================================================================
    // RETURN VALUES
    // ============================================================================

    return {
        // Connection
        connectWallet,
        disconnectWallet,
        connectionStatus,
        
        // Data
        presaleStatus,
        userInfo,
        purchaseLimits,
        
        // Operations
        previewPurchase,
        executePurchase,
        approveTokens,
        switchToSepolia,
        
        // Utilities
        refreshAllData,
        refreshPresaleStatus,
        refreshUserInfo,
        refreshPurchaseLimits,
        
        // State
        loading,
        error,
        setError
    };
};

export default useNexusWealthPresale;
