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
    bid: bidData,
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { price } = useMintCgk(mintAddress)

  useEffect(() => {
    ;(async () => {
      const db = createPDB(walletAddress, appId)

      if (!txId || !db) return
      const prevAmount = await db.getItem(PDB_KEY)
      let swapAmountSuccess = Number(bidAmount) * price
      if (prevAmount) swapAmountSuccess += Number(prevAmount)
      await db.setItem(PDB_KEY, swapAmountSuccess)
    })()
  }, [bidAmount, bidData, price, txId, walletAddress])

  return <Fragment />
}
export default ValidateSwap
