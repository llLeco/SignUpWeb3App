import { Injectable } from '@angular/core';
import { AccountBalance, AccountBalanceQuery, AccountCreateTransaction, AccountInfoQuery, Client, Hbar, Mnemonic, PrivateKey, Transfer, TransferTransaction } from '@hashgraph/sdk';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { Observable, catchError, throwError } from 'rxjs';

export enum ELocalStorage {
  signUpConnectKey = 'signUpConnectKey',
}

export interface IUser {
  wallet: IHUserWallet;
  contacts: IHContact[];
}

export interface IHWalletDTO {
  id: string;
  publicKey: string;
  privateKey: string;
}

export interface IHUserWallet {
  name: string;
  key: PrivateKey | string;
  id: string;
  net: 'testnet' | 'mainnet';
}

export interface IHSendTransaction {
  from: string;
  to: string;
  amount: number;
}

export interface IHContact {
  name: string;
  walletId: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class HederaService {

  client!: Client;
  userInfo?: IUser;

  constructor(private http: HttpClient) { }

  //generate mnemonics object
  async generateMnemonics(): Promise<Mnemonic> {
    return await Mnemonic.generate();
  }

  //create account on Hedera
  createAccount(mnemonic: Mnemonic) {
    if (mnemonic) {
      return this.http.post<IHWalletDTO>('http://localhost:3000/create', mnemonic).pipe(
        catchError((error: any) => {
          console.error('Error creating account:', error);
          return throwError(() => new Error(error));
        })
      );
    }
    throw new Error('Invalid mnemonic');
  }

  //Encrypt and store account on Hedera
  saveUserAccount(wallet: IUser, password: string): void {
    const encrypt = CryptoJS.AES.encrypt(JSON.stringify(wallet), password).toString();
    const encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encrypt));
    localStorage.setItem(ELocalStorage.signUpConnectKey, encData);
  }

  //Decrypt and retrieve account from Hedera
  decyptuserInfo(password: string): IUser | undefined {
    const local = localStorage.getItem(ELocalStorage.signUpConnectKey);
    if (local) {
      const decData = CryptoJS.enc.Base64.parse(local).toString(CryptoJS.enc.Utf8);
      const decrypted = CryptoJS.AES.decrypt(decData, password).toString(CryptoJS.enc.Utf8);
      if (decrypted) {
        const wallet = JSON.parse(decrypted);
        if (wallet) {
          return wallet;
        }
      }
    }
    return undefined;
  }

  // Init hedera client with user credentials
  initClient(password: string): boolean {
    console.log('initClient with password:', password);
    if (!password) {
      throw new Error('Password required to init client');
    }

    const getWallet = this.decyptuserInfo(password);
    console.log('getWallet:', getWallet);
    if (getWallet && getWallet.wallet.id && getWallet.wallet.key) {
      this.userInfo = getWallet;
      if (this.userInfo.wallet.net === 'testnet')
        this.client = Client.forTestnet().setOperator(this.userInfo.wallet.id, this.userInfo.wallet.key);
      else
        this.client = Client.forMainnet().setOperator(this.userInfo.wallet.id, this.userInfo.wallet.key);
      return true;
    } else {
      throw new Error('Failed to decrypt user information or invalid user info');
    }
  }


  //get all transactions
  getAllTransactions(): Observable<any> {
    return this.http.get(`http://${this.userInfo?.wallet.net}.mirrornode.hedera.com/api/v1/transactions?account.id=${this.userInfo?.wallet.id}`);
  }

  async sendTransaction(transaction: IHSendTransaction): Promise<any> {
    if (!transaction || !transaction.from || !transaction.to || !transaction.amount) {
      throw new Error('Invalid transaction');
    }

    try {
      const sendHbar = await new TransferTransaction()
        .addHbarTransfer(transaction.from, new Hbar(-transaction.amount))
        .addHbarTransfer(transaction.to, new Hbar(transaction.amount))
        .execute(this.client);

      const getReceipt = await sendHbar.getReceipt(this.client);
      return getReceipt;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  async getAccountBalance(): Promise<AccountBalance | undefined> {
    if(this.userInfo) {
      const accountBalance = await new AccountBalanceQuery()
      .setAccountId(this.userInfo.wallet.id)
      .execute(this.client);

      return accountBalance;
    } else {
      return undefined;
    }
  }

  async verifyAccount(wallet: any): Promise<any> {
    const client = Client.forTestnet().setOperator(wallet.id, wallet.privateKey);

    const account = await new AccountInfoQuery()
      .setAccountId(wallet.id)
      .execute(client);

    return account;
  }

}
