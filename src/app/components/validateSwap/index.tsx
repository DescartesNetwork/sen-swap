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
const PDB_KEY = 'validate_swap'

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
      const prevLogs: { txId: string[]; amount: number } = (await db.getItem(
        PDB_KEY,
      )) || { txId: [], amount: 0 }
      let swapAmountSuccess = Number(bidAmount) * price
      const listTxId = prevLogs.txId
      if (txId && !listTxId.includes(txId)) listTxId.push(txId)
      if (prevLogs.amount) swapAmountSuccess += prevLogs.amount
      const swapLogs = { txId: listTxId, amount: swapAmountSuccess }
      await db.setItem(PDB_KEY, swapLogs)
    })()
  }, [bidAmount, price, txId, walletAddress])

  return <Fragment />
}
export default ValidateSwap
