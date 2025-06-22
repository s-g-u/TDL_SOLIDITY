import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { formatEther, parseEther, getContract } from 'viem';
import { WalletService, WalletState } from './wallet.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly CONTRACT_ADDRESS = '0x406c9D3c1CeC0a65b9266A112257980C340cB718';
  private readonly CONTRACT_ABI = [
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "priceFeedM",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "nftAddress",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "durationInMinutes",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "goalUSD",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "tokenAddress",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "fallback",
      "stateMutability": "payable"
    },
    {
      "type": "receive",
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "MINIMUM_USD",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "addressToAmountFunded",
      "inputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "cashbackPercentage",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "extendDeadline",
      "inputs": [
        {
          "name": "additionalMinutes",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "fund",
      "inputs": [],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "funders",
      "inputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getFundersCount",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getProgress",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getTotalFunded",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getTotalFundedInUSD",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getVersion",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "i_deadline",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "i_goalUSD",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "i_owner",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "refund",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "rewardRandomFunder",
      "inputs": [
        {
          "name": "tokenURI",
          "type": "string",
          "internalType": "string"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "withdraw",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "FundReceived",
      "inputs": [
        {
          "name": "funder",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "FundsWithdrawn",
      "inputs": [
        {
          "name": "owner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "CrowdFunding__NotOwner",
      "inputs": []
    },
    {
      "type": "error",
      "name": "CrowdFunding__WithdrawFailed",
      "inputs": []
    }
  ] as const;

  public walletState: WalletState = {
    isConnected: false,
    address: null,
    chainId: null,
    connecting: false
  };

  public totalFundedEth = '0';
  public totalFundedUSD = '$0.00';
  public fundersCount = '0';
  public progress = 0;
  public goalUSD = '$0.00';
  public deadlineDate = '';
  public isDeadlinePassed = false;
  public userContribution = 0;
  public isOwner = false;

  public funding = false;
  public withdrawing = false;
  public refunding = false;
  public extending = false;

  public fundAmount = '';
  public extendMinutes = '';

  private contract: any;
  private walletSubscription: Subscription | null = null;

  private walletService = inject(WalletService);

  ngOnInit() {
    this.walletSubscription = this.walletService.walletState$.subscribe(
      (state: WalletState) => {
        this.walletState = state;
        if (state.isConnected && state.address) {
          setTimeout(() => {
            this.initializeContract();
            this.loadContractData();
          }, 100);
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.walletSubscription) {
      this.walletSubscription.unsubscribe();
    }
  }

  public get isConnected() { return this.walletState.isConnected; }
  public get connecting() { return this.walletState.connecting; }
  public get userAddress() { return this.walletState.address || ''; }

  public async connectWallet() {
    await this.walletService.connectWallet();
  }

  public disconnect() {
    this.walletService.disconnect();
  }

  private initializeContract() {
    if (this.walletService.publicClient && this.walletService.walletClient) {
      this.contract = getContract({
        address: this.CONTRACT_ADDRESS as `0x${string}`,
        abi: this.CONTRACT_ABI,
        client: { 
          public: this.walletService.publicClient, 
          wallet: this.walletService.walletClient 
        }
      });
    }
  }

  private async loadContractData() {
    if (!this.contract || !this.walletState.address) return;

    try {
      try {
        const totalFunded = await this.contract.read.getTotalFunded();
        this.totalFundedEth = parseFloat(formatEther(totalFunded)).toFixed(4);
      } catch (error) {
      }

      try {
        const totalFundedUSD = await this.contract.read.getTotalFundedInUSD();
        this.totalFundedUSD = this.formatUSD(totalFundedUSD);
      } catch (error) {
      }

      try {
        const fundersCount = await this.contract.read.getFundersCount();
        this.fundersCount = fundersCount.toString();
      } catch (error) {
      }

      try {
        const owner = await this.contract.read.i_owner();
        this.isOwner = owner.toLowerCase() === this.walletState.address?.toLowerCase();
      } catch (error) {
      }

      try {
        const userContrib = await this.contract.read.addressToAmountFunded([this.walletState.address as `0x${string}`]);
        this.userContribution = parseFloat(formatEther(userContrib));
      } catch (error) {
      }

      try {
        const goalUSD = await this.contract.read.i_goalUSD();
        this.goalUSD = this.formatUSD(goalUSD);
      } catch (error) {
        this.goalUSD = 'No definido';
      }

      try {
        const deadline = await this.contract.read.i_deadline();
        const deadlineDate = new Date(Number(deadline) * 1000);
        this.deadlineDate = deadlineDate.toLocaleString('es-ES');
        this.isDeadlinePassed = Date.now() > Number(deadline) * 1000;
      } catch (error) {
        this.deadlineDate = 'No definido';
        this.isDeadlinePassed = false;
      }

      try {
        const progress = await this.contract.read.getProgress();
        this.progress = Number(progress);
      } catch (error) {
        this.progress = 0;
      }

    } catch (error) {
    }
  }

  public async fund() {
    if (!this.fundAmount || !this.contract) {
      return;
    }

    const fundAmountStr = String(this.fundAmount).trim();
    if (!fundAmountStr || isNaN(Number(fundAmountStr))) {
      alert('Por favor ingresa un monto válido');
      return;
    }

    this.funding = true;
    try {
      const hash = await this.contract.write.fund({
        value: parseEther(fundAmountStr),
        account: this.walletState.address as `0x${string}`
      });

      await this.walletService.publicClient.waitForTransactionReceipt({ hash });
      
      this.fundAmount = '';
      await this.loadContractData();
      
      alert('¡Contribución exitosa!');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('deadline') || error.message.includes('expired')) {
          alert('El crowdfunding ha expirado. No se pueden hacer más contribuciones.');
        } else if (error.message.includes('minimum') || error.message.includes('USD')) {
          alert('El monto no cumple el mínimo requerido.');
        } else if (error.message.includes('goal') || error.message.includes('reached')) {
          alert('La meta del crowdfunding ya fue alcanzada.');
        } else {
          alert('Error al contribuir. Revisa la consola para más detalles.');
        }
      } else {
        alert('Error al contribuir.');
      }
    } finally {
      this.funding = false;
    }
  }

  public async withdraw() {
    if (!this.contract) return;

    this.withdrawing = true;
    try {
      const hash = await this.contract.write.withdraw({
        account: this.walletState.address as `0x${string}`
      });

      await this.walletService.publicClient.waitForTransactionReceipt({ hash });
      await this.loadContractData();
      
      alert('¡Fondos retirados exitosamente!');
    } catch (error) {
      alert('Error al retirar fondos. Revisa la consola para más detalles.');
    } finally {
      this.withdrawing = false;
    }
  }

  public async refund() {
    if (!this.contract) return;

    this.refunding = true;
    try {
      const hash = await this.contract.write.refund({
        account: this.walletState.address as `0x${string}`
      });

      await this.walletService.publicClient.waitForTransactionReceipt({ hash });
      await this.loadContractData();
      
      alert('¡Reembolso procesado exitosamente!');
    } catch (error) {
      alert('Error al solicitar reembolso. Revisa la consola para más detalles.');
    } finally {
      this.refunding = false;
    }
  }

  public async extendDeadline() {
    if (!this.extendMinutes || !this.contract) return;

    this.extending = true;
    try {
      const hash = await this.contract.write.extendDeadline([parseInt(this.extendMinutes)], {
        account: this.walletState.address as `0x${string}`
      });

      await this.walletService.publicClient.waitForTransactionReceipt({ hash });
      await this.loadContractData();
      
      this.extendMinutes = '';
      alert('¡Deadline extendido exitosamente!');
    } catch (error) {
      alert('Error al extender deadline. Revisa la consola para más detalles.');
    } finally {
      this.extending = false;
    }
  }

  private formatUSD(value: bigint): string {
    const usdValue = Number(value) / 1e18;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(usdValue);
  }
} 