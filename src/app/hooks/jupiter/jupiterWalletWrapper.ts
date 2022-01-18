import { account, WalletInterface } from '@senswap/sen-js'
import {
  PublicKey,
  Transaction,
  Connection,
  TransactionSignature,
} from '@solana/web3.js'
import { SendTransactionOptions } from '@solana/wallet-adapter-base'

class JupiterWalletWrapper {
  private _wallet
  public publicKey: PublicKey

  constructor(address: string, wallet: WalletInterface) {
    this._wallet = wallet
    this.publicKey = account.fromAddress(address) || null
  }

  async sendTransaction(
    transaction: Transaction,
    connection: Connection,
    options?: SendTransactionOptions,
  ): Promise<TransactionSignature> {
    transaction = await this.signTransaction(transaction)
    return await connection.sendRawTransaction(
      transaction.serializeMessage(),
      options,
    )
  }

  async signTransaction(transaction: Transaction) {
    return await this._wallet.signTransaction(transaction)
  }

  async signAllTransactions(transactions: Transaction[]) {
    const signedTransactions = []
    for (const transaction of transactions) {
      const signedTransaction = await this.signTransaction(transaction)
      signedTransactions.push(signedTransaction)
    }
    return signedTransactions
  }
}

export default JupiterWalletWrapper
