import { Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useWallet } from '@senhub/providers'

import useMintCgk from 'app/hooks/useMintCgk'
import { createPDB } from 'shared/pdb'
import { AppState } from 'app/model'
import configs from 'app/configs'

const {
  manifest: { appId },
} = configs
const PDB_KEY = 'validated_swap_transaction'

const ValidateSwap = ({ txId = '' }: { txId?: string }) => {
  const {
    bid: {
      amount: bidAmount,
      mintInfo: { address: mintAddress },
    },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { price } = useMintCgk(mintAddress)

  useEffect(() => {
    ;(async () => {
      const db = createPDB(walletAddress, appId)
      if (!txId || !db) return
      const prevLogs: { txIds: string[]; amount: number } = (await db.getItem(
        PDB_KEY,
      )) || { txIds: [], amount: 0 }
      let swapAmountSuccess = Number(bidAmount) * price
      const listTxIds = prevLogs.txIds
      if (txId && !listTxIds?.includes(txId)) listTxIds.push(txId)
      if (prevLogs.amount) swapAmountSuccess += prevLogs.amount
      const swapLogs = { txIds: listTxIds, amount: swapAmountSuccess }
      await db.setItem(PDB_KEY, swapLogs)
    })()
  }, [bidAmount, price, txId, walletAddress])

  return <Fragment />
}
export default ValidateSwap
