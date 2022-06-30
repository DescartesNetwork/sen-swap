export class TransLog {
  programId: string = ''

  programInfo: ProgramInfo | undefined

  signature: string = ''

  blockTime: number = 0

  time: number = 0

  owner: string = ''

  actionType: string = ''

  actionTransfers: Array<ActionTransfer> = []

  programTransfer: Array<ActionTransfer> = []
}

export class ActionInfo {
  address: string = ''

  // pool: string = ''

  mint: string = ''

  decimals: number = 0

  preBalance: string = '0'

  postBalance: string = '0'
}
/**
 * Amount is not same postBalance - preBalance
 * @postBalance and @preBalance are balance after all action (transaction)
 * @postBalance = @preBalance +- all @amount (multi amount in transaction)
 * @amount is value in 1 action
 */
export class ActionTransfer {
  source: ActionInfo | undefined

  destination: ActionInfo | undefined

  amount: string = '0'
}
type ProgramInfo = {
  programId: string
  data: string
}
