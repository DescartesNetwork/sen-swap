//@ts-ignore
import {
  ParsedConfirmedTransaction,
  ParsedInstruction,
  ParsedMessageAccount,
  PartiallyDecodedInstruction,
  TokenBalance,
} from '@solana/web3.js'
import { account } from '@senswap/sen-js'

import { ActionInfo, ActionTransfer, TransLog } from '../entities/trans-log'
import { Solana } from '../adapters/solana/client'
import {
  OptionsFetchSignature,
  ParsedAction,
  ParsedInfoTransfer,
  ParsedType,
} from '../constants/transaction'
import { DateHelper } from '../helpers/date'
import { SOL_ADDRESS, SOL_DECIMALS } from '../constants/sol'

type InstructionData = ParsedInstruction | PartiallyDecodedInstruction

export class TransLogService {
  solana: Solana
  constructor() {
    this.solana = new Solana()
  }

  protected parseAction = (transLog: TransLog) => {
    return ''
  }

  async collect(
    programId: string,
    configs: OptionsFetchSignature,
    funcFilter?: (transLog: TransLog) => boolean,
  ): Promise<TransLog[]> {
    let { lastSignature, limit } = configs

    let isStop = false
    let transLogs: Array<TransLog> = []
    let lastSignatureTmp = lastSignature

    while (!isStop) {
      const confirmedTrans: ParsedConfirmedTransaction[] =
        await this.solana.fetchTransactions(programId, {
          ...configs,
          lastSignature: lastSignatureTmp,
        })

      for (const trans of confirmedTrans) {
        lastSignatureTmp = trans.transaction.signatures[0]
        const log = this.parseTransLog(trans)
        if (log) transLogs.push(log)
      }

      if (funcFilter) {
        transLogs = transLogs.filter((trans) => funcFilter(trans))

        if (!confirmedTrans.length || isStop) break
        if (limit && transLogs.length >= limit) {
          isStop = true
          break
        }
      } else break
    }
    return transLogs
  }
  private parseTransLog(
    confirmedTrans: ParsedConfirmedTransaction,
  ): TransLog | undefined {
    const { blockTime, meta, transaction } = confirmedTrans
    if (!blockTime || !meta) return
    const { postTokenBalances, preTokenBalances, postBalances, preBalances } =
      meta
    const { signatures, message } = transaction

    const innerInstructionData = meta.innerInstructions?.[0]?.instructions || []
    const instructionData = message.instructions[0] || []

    const transLog = new TransLog()
    transLog.signature = signatures[0]
    transLog.blockTime = blockTime
    transLog.time = DateHelper.fromSeconds(blockTime).ymd()
    transLog.programId = instructionData.programId.toString()

    const mapAccount = this.parseAccountInfo(
      message.accountKeys,
      postTokenBalances || [],
      preTokenBalances || [],
      postBalances,
      preBalances,
    )
    // system program transaction
    if (this.isParsedInstruction(instructionData)) {
      transLog.programTransfer = this.parseListActionTransfer(
        [instructionData],
        mapAccount,
      )
      return transLog
    }
    // smart contract transaction
    transLog.actionTransfers = this.parseListActionTransfer(
      innerInstructionData,
      mapAccount,
    )
    transLog.programInfo = {
      programId: instructionData.programId.toString(),
      data: (instructionData as PartiallyDecodedInstruction).data,
    }
    transLog.actionType = this.parseAction(transLog)
    return transLog
  }

  private isParsedInstruction(instructionData: InstructionData) {
    return (instructionData as ParsedInstruction).parsed !== undefined
  }

  private parseListActionTransfer(
    actions: InstructionData[],
    mapAccount: Map<string, ActionInfo>,
  ) {
    const actionTransfer: ActionTransfer[] = []
    for (const action of actions) {
      if (!this.isParsedInstruction(action)) continue
      const actionParsed: ParsedAction =
        (action as ParsedInstruction).parsed || {}
      switch (actionParsed.type) {
        case ParsedType.Transfer:
          const info: ParsedInfoTransfer = actionParsed.info
          const parsedAction = this.parseActionTransfer(info, mapAccount)
          if (parsedAction) actionTransfer.push(parsedAction)
          break
        default:
          break
      }
    }
    return actionTransfer
  }

  private parseActionTransfer(
    parsedTransfer: ParsedInfoTransfer,
    mapAccount: Map<string, ActionInfo>,
  ): ActionTransfer | undefined {
    const { source, destination, amount, lamports } = parsedTransfer
    const amountTransfer = amount || lamports.toString()

    if (
      !amountTransfer ||
      !mapAccount.has(source) ||
      !mapAccount.has(destination)
    )
      return

    const actionTransfer = new ActionTransfer()
    actionTransfer.source = mapAccount.get(source)
    actionTransfer.destination = mapAccount.get(destination)
    actionTransfer.amount = amountTransfer
    return actionTransfer
  }

  private parseAccountInfo(
    accountKeys: Array<ParsedMessageAccount>,
    postTokenBalances: Array<TokenBalance>,
    preTokenBalances: Array<TokenBalance>,
    postBalances: number[],
    preBalances: number[],
  ): Map<string, ActionInfo> {
    const mapAccountInfo = new Map<string, ActionInfo>()

    // Associated Address
    for (const postBalance of postTokenBalances) {
      const { accountIndex, mint, uiTokenAmount } = postBalance
      const info = new ActionInfo()
      info.address = accountKeys[accountIndex].pubkey.toString()
      info.postBalance = uiTokenAmount.amount
      info.mint = mint
      info.decimals = uiTokenAmount.decimals
      mapAccountInfo.set(info.address, info)
    }

    for (const preBalance of preTokenBalances) {
      const { accountIndex, uiTokenAmount } = preBalance
      const address = accountKeys[accountIndex].pubkey.toString()
      const info = mapAccountInfo.get(address) || new ActionInfo()
      info.preBalance = uiTokenAmount.amount
      mapAccountInfo.set(info.address, info)
    }

    // Wallet address
    accountKeys.forEach((accountData, idx) => {
      const address = accountData.pubkey.toString()
      if (!account.isAssociatedAddress(address)) {
        const info = mapAccountInfo.get(address) || new ActionInfo()
        info.address = address
        info.mint = SOL_ADDRESS
        info.postBalance = String(postBalances[idx] || 0) // lamports
        info.preBalance = String(preBalances[idx] || 0) // lamports
        info.decimals = SOL_DECIMALS
        mapAccountInfo.set(info.address, info)
      }
    })

    return mapAccountInfo
  }
}
