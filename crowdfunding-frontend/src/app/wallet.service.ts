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
    // Solo inicializo si estamos en el navegador y si MetaMask está disponible
    if (typeof window !== 'undefined' && window.ethereum) {
      // El publicClient me sirve para leer datos de la blockchain
      this.publicClient = createPublicClient({
        chain: sepolia,
        transport: http()
      });
    }
  }

  private async checkConnection() {
    // Verifico si ya hay una wallet conectada al cargar la página
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          // Actualizo el estado si encontré una cuenta conectada
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
      // Cuando el usuario cambia de cuenta en MetaMask
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          // Si no hay cuentas, significa que se desconectó
          this.disconnect();
        } else {
          // Si hay cuentas, actualizo con la nueva dirección
          this.updateWalletState({
            ...this.walletState.value,
            address: accounts[0]
          });
        }
      });

      // Cuando el usuario cambia de red
      window.ethereum.on('chainChanged', (chainId: string) => {
        this.updateWalletState({
          ...this.walletState.value,
          chainId: parseInt(chainId, 16)
        });
      });

      // Cuando MetaMask se desconecta completamente
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

    // Pongo connecting en true para mostrar loading en la UI
    this.updateWalletState({
      ...this.walletState.value,
      connecting: true
    });

    try {
      // Pido al usuario que conecte su wallet
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length === 0) {
        throw new Error('No se seleccionó ninguna cuenta');
      }

      // Me aseguro de que esté en la red Sepolia
      await this.switchToSepolia();

      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      // Actualizo el estado con la información de la wallet conectada
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
      
      // Reseteo el estado si algo salió mal
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
    // Me aseguro que el usuario esté en la red de testnet Sepolia
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
      });
    } catch (switchError: any) {
      // Si la red no está agregada en MetaMask, la agrego 
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
    // El walletClient me permite enviar transacciones (el publicClient solo lee)
    if (window.ethereum) {
      this.walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum)
      });
    }
  }

  public disconnect() {
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
    // La uso para que aparezca el token CBK de cashback después de hacer una donación
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

// Declaro el tipo para TypeScript, así no me da errores con window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
} 