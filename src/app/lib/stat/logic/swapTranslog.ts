import base58 from 'bs58'

import { TransLog } from '../entities/trans-log'
import { TransLogService } from './translog'

const { struct } = require('soprox-abi')

const TRANSLOG_PROGRAM_DATA_SCHEMA = { key: 'code', type: 'u8' }

export enum SwapActionType {
  Route = 'SWAP',
}

const ACTION_TYPE: Record<number, SwapActionType> = {
  8: SwapActionType.Route,
}

export default class SwapTranslogService extends TransLogService {
  parseAction = (transLog: TransLog) => {
    const programDataEncode = transLog.programInfo?.data
    if (!programDataEncode) return ''

    const dataBuffer = base58.decode(programDataEncode)
    const actionLayout = new struct([TRANSLOG_PROGRAM_DATA_SCHEMA])
    const programDataDecode: { code: number } = actionLayout.fromBuffer(
      Buffer.from(dataBuffer),
    )
    return ACTION_TYPE[programDataDecode.code] || ''
  }
}
