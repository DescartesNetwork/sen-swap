export enum ParsedType {
  Transfer = 'transfer',
}

export type ParsedAction = {
  type: ParsedType
  info: ParsedInfoTransfer
}

export type ParsedInfoTransfer = {
  source: string
  destination: string
  amount: string
  lamports: number
}

export type OptionsFetchSignature = {
  limit?: number
  lastSignature?: string
  secondFrom?: number
  secondTo?: number
}
