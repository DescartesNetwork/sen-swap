import {
  ConfirmedSignatureInfo,
  ConfirmedSignaturesForAddress2Options,
  Connection,
  ParsedConfirmedTransaction,
  PublicKey,
} from '@solana/web3.js'

import { OptionsFetchSignature } from '../../constants/transaction'
import configs from 'app/configs'

const DEFAULT_LIMIT = 700
const TRANSACTION_LIMIT = 200

const {
  sol: { statNode },
} = configs

export class Solana {
  private conn: Connection = new Connection(statNode)

  //Search for all signatures from last Signature and earlier
  //So: If new collection (to now) -> last Signature = null
  private async fetchSignatures(
    address: PublicKey,
    lastSignature?: string,
    limit: number = DEFAULT_LIMIT,
  ): Promise<Array<ConfirmedSignatureInfo>> {
    if (limit > DEFAULT_LIMIT) limit = DEFAULT_LIMIT
    const options: ConfirmedSignaturesForAddress2Options = {
      limit: limit,
      before: lastSignature,
    }
    return this.conn.getConfirmedSignaturesForAddress2(address, options)
  }

  private async fetchConfirmTransaction(signatures: string[]) {
    let confirmedTransactions: ParsedConfirmedTransaction[] = []
    let limit = TRANSACTION_LIMIT

    const promiseTransGroup = []
    for (let offset = 0; offset <= signatures.length / limit; offset++) {
      const skip = offset * limit
      const signaturesGroup = signatures.slice(skip, skip + limit)
      promiseTransGroup.push(
        this.conn.getParsedConfirmedTransactions(signaturesGroup),
      )
    }

    const transGroups = await Promise.all(promiseTransGroup)
    for (const transGroup of transGroups) {
      //@ts-ignore
      confirmedTransactions = confirmedTransactions.concat(transGroup)
    }
    return confirmedTransactions
  }

  async fetchTransactions(
    programId: string,
    options: OptionsFetchSignature,
  ): Promise<ParsedConfirmedTransaction[]> {
    const currentTime = new Date().getTime() / 1000
    let { secondFrom, secondTo, lastSignature, limit } = options
    secondFrom = Math.floor(secondFrom || 0)
    secondTo = Math.floor(secondTo || currentTime)

    const programPublicKey = new PublicKey(programId)
    let signatures: string[] = []
    let isStop = false

    while (!isStop) {
      const confirmedSignatureInfos: ConfirmedSignatureInfo[] =
        await this.fetchSignatures(programPublicKey, lastSignature, limit)
      if (!confirmedSignatureInfos?.length || isStop) break
      for (const info of confirmedSignatureInfos) {
        const blockTime = info.blockTime
        if (!blockTime || blockTime > secondTo) continue
        if (blockTime < secondFrom) {
          isStop = true
          break
        }
        lastSignature = info.signature
        signatures.push(info.signature)
      }

      if (limit && signatures.length >= limit) break
      if (confirmedSignatureInfos?.length < DEFAULT_LIMIT) break
    }
    const confirmedTransactions = await this.fetchConfirmTransaction(signatures)
    return confirmedTransactions
  }
}
