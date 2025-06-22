import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { sepolia } from 'viem/chains';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  connecting: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private walletState = new BehaviorSubject<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    connecting: false
  });

  public walletState$ = this.walletState.asObservable();
  public publicClient: any;
  public walletClient: any;

  constructor() {
    this.initializeClients();
    this.checkConnection();
    this.setupEventListeners();
  }

  private initializeClients() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.publicClient = createPublicClient({
        chain: sepolia,
        transport: http()
      });
    }
  }

  private async checkConnection() {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          this.updateWalletState({
            isConnected: true,
            address: accounts[0],
            chainId: parseInt(chainId, 16),
            connecting: false
          });
          this.initializeWalletClient();
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  }

  private setupEventListeners() {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          this.disconnect();
        } else {
          this.updateWalletState({
            ...this.walletState.value,
            address: accounts[0]
          });
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        this.updateWalletState({
          ...this.walletState.value,
          chainId: parseInt(chainId, 16)
        });
      });

      window.ethereum.on('disconnect', () => {
        this.disconnect();
      });
    }
  }

  async connectWallet(): Promise<boolean> {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Por favor instala MetaMask para continuar');
      return false;
    }

    this.updateWalletState({
      ...this.walletState.value,
      connecting: true
    });

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length === 0) {
        throw new Error('No se seleccionó ninguna cuenta');
      }

      await this.switchToSepolia();

      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      this.updateWalletState({
        isConnected: true,
        address: accounts[0],
        chainId: parseInt(chainId, 16),
        connecting: false
      });

      this.initializeWalletClient();
      return true;

    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      
      this.updateWalletState({
        isConnected: false,
        address: null,
        chainId: null,
        connecting: false
      });

      if (error.code === 4001) {
        alert('Conexión cancelada por el usuario');
      } else {
        alert('Error al conectar la wallet: ' + error.message);
      }
      
      return false;
    }
  }

  private async switchToSepolia() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
      });
    } catch (switchError: any) {
      // Si la red no está agregada, la agregamos
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia Test Network',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io/']
            }]
          });
        } catch (addError) {
          console.error('Error adding Sepolia network:', addError);
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  }

  private initializeWalletClient() {
    if (window.ethereum) {
      this.walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum)
      });
    }
  }

  disconnect() {
    this.updateWalletState({
      isConnected: false,
      address: null,
      chainId: null,
      connecting: false
    });
    this.walletClient = null;
  }

  private updateWalletState(newState: WalletState) {
    this.walletState.next(newState);
  }

  getCurrentState(): WalletState {
    return this.walletState.value;
  }

  isCorrectNetwork(): boolean {
    return this.walletState.value.chainId === sepolia.id;
  }

  async addTokenToWallet(tokenAddress: string, tokenSymbol: string, tokenDecimals: number) {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
          },
        },
      });
      return true;
    } catch (error) {
      console.error('Error adding token to wallet:', error);
      return false;
    }
  }
}

declare global {
  interface Window {
    ethereum?: any;
  }
} 