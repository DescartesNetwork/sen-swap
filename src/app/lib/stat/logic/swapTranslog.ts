//@ts-ignore
import { base58_to_binary } from '@relocke/base58'
//@ts-ignore
import { struct } from 'soprox-abi'
import { TransLog } from '../entities/trans-log'
import { TransLogService } from './translog'

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
    const dataBuffer = base58_to_binary(programDataEncode)
    const actionLayout = new struct([TRANSLOG_PROGRAM_DATA_SCHEMA])
    const programDataDecode: { code: number } = actionLayout.fromBuffer(
      Buffer.from(dataBuffer),
    )
    return ACTION_TYPE[programDataDecode.code] || ''
  }
}
