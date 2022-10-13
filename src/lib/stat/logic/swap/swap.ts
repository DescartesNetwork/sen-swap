import { net, createPDB } from '@sentre/senhub'
import configs from 'configs'
import IPFS from 'helper/ipfs'

import { TransLog } from '../../entities/trans-log'
import { DateHelper } from '../../helpers/date'
import SwapTransLogService, { SwapActionType } from '../translogSwap'

const {
  sol: { swapAddress },
  manifest: { appId },
} = configs

const DATE_RANGE = 30
const CACHE_KEY = `translogs-ipfs:${net}`

export default class SwapService {
  programId: string
  transLogService: SwapTransLogService = new SwapTransLogService()
  constructor(address: string) {
    this.programId = address
  }

  private async getPDB() {
    const walletAddress = await window.sentre.solana?.getAddress()
    if (!walletAddress) throw new Error('Invalid wallet address')
    const db = createPDB(walletAddress, appId)
    if (!db) throw new Error('Can not create pdb')
    return db
  }

  fetchTransLog = async (timeFrom: number, timeTo: number) => {
    const ipfs = new IPFS()
    let cacheTransLog: TransLog[] = []
    const db = await this.getPDB()
    const keyBackup = await db.getItem(CACHE_KEY)
    if (keyBackup) cacheTransLog = await ipfs.get(keyBackup)

    const fistTransLog = cacheTransLog[0]
    const lastTransLog = cacheTransLog[cacheTransLog.length - 1]

    if (fistTransLog && lastTransLog) {
      const [beginTransLogs] = await Promise.all([
        this.transLogService.collect(this.programId, {
          secondFrom: fistTransLog.blockTime,
          secondTo: timeTo,
        }),
      ])
      cacheTransLog = cacheTransLog.filter(
        (trans) => trans.blockTime > timeFrom,
      )
      cacheTransLog = [...beginTransLogs, ...cacheTransLog]
    } else {
      cacheTransLog = await this.transLogService.collect(this.programId, {
        secondFrom: timeFrom,
        secondTo: timeTo,
      })
    }
    // Filter transLog swap
    const mapTransLogs: Record<string, TransLog> = {}
    for (const log of cacheTransLog) {
      if (
        log.actionType === SwapActionType.Route &&
        log.programId === swapAddress
      )
        mapTransLogs[log.signature] = log
    }

    const newTransLogs = Object.values(mapTransLogs).sort(
      (a, b) => b.blockTime - a.blockTime,
    )

    const newIpfsKey = await ipfs.set(newTransLogs)
    await db.setItem(CACHE_KEY, newIpfsKey)
    return newTransLogs
  }

  fetchHistory = async () => {
    let timeTo = new DateHelper()
    const timeFrom = new DateHelper().subtractDay(DATE_RANGE)
    // fetch transLog
    const transLogs = await this.fetchTransLog(
      timeFrom.seconds(),
      timeTo.seconds(),
    )
    return transLogs.sort((a, b) => b.blockTime - a.blockTime)
  }
}
