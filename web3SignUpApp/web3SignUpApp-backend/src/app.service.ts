import { AccountCreateTransaction, Client, Hbar, Mnemonic, Status } from '@hashgraph/sdk';
import { Injectable, Logger } from '@nestjs/common';

export interface IHederaAccount {
  id: string;
  publicKey: string;
  privateKey: string;
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  client: Client;

  accountId = process.env.HEDERA_ACCOUNT;
  privateKey = process.env.HEDERA_PRIVATE;

  async createAccount(mnemonics: Mnemonic): Promise<IHederaAccount> {
    this.logger.debug('createAccount() --> ', this.accountId, this.privateKey, mnemonics._mnemonic.words);

    this.client = Client.forTestnet().setOperator(this.accountId, this.privateKey);

    this.logger.debug('this.client --> ', this.client);

    const mnemonicObj = await Mnemonic.fromWords(mnemonics._mnemonic.words);
    const privateKey = await mnemonicObj.toLegacyPrivateKey();
    const publicKey = privateKey.publicKey;

    let newAccount;
    let getReceipt;
    let delay = 1000; // start with 1 second delay

    while (true) {
      try {
        newAccount = await new AccountCreateTransaction()
          .setKey(publicKey)
          .setInitialBalance(new Hbar(50))
          .execute(this.client);

        getReceipt = await newAccount.getReceipt(this.client);

        // If the transaction is successful, break the loop
        break;
      } catch (error) {
        if (error.toString().includes(Status.Busy.toString())) {
          // If the network is busy, wait for a while before retrying
          this.logger.warn(`Network is busy, retrying in ${delay / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));

          // Increase the delay for the next attempt, up to a maximum of 1 minute
          delay = Math.min(delay * 2, 60000);
        } else {
          // If it's a different error, log it and rethrow
          this.logger.error('Failed to create new account', error);
          throw error;
        }
      }
    }

    const newAccountId = getReceipt.accountId;

    this.logger.debug('newAccountId --> ', newAccountId.toString());

    const account: IHederaAccount = {
      id: newAccountId.toString(),
      publicKey: publicKey.toStringRaw(),
      privateKey: privateKey.toStringRaw()
    };

    this.logger.debug('account --> ', account);

    return account;
  }
}
