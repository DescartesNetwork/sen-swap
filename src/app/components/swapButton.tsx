import { useCallback, useState } from 'react'
import { utils } from '@senswap/sen-js'
import { useSelector } from 'react-redux'

import { Button } from 'antd'
import { HopData } from './preview/hop'
import { AppState } from 'app/model'
import { useWallet } from 'senhub/providers'
import { explorer } from 'shared/util'

const DECIMALS = BigInt(1000000000)

const SwapButton = ({
  hops,
  onCallback = () => {},
  disabled = false,
  wrapAmount = BigInt(0),
}: {
  hops: HopData[]
  onCallback?: () => void
  disabled?: boolean
  wrapAmount: bigint
}) => {
  const [loading, setLoading] = useState(false)
  const bidData = useSelector((state: AppState) => state.bid)
  const askData = useSelector((state: AppState) => state.ask)
  const { slippage } = useSelector((state: AppState) => state.settings)
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  /**
   * Swap function
   */
  const handleSwap = useCallback(async () => {
    const { swap, splt, wallet } = window.sentre
    if (!wallet) return
    // Synthetize routings
    const routingAddresses = await Promise.all(
      hops.map(
        async ({
          srcMintInfo: { address: srcMintAddress },
          dstMintInfo: { address: dstMintAddress },
          poolData: { address: poolAddress },
        }) => {
          const srcAddress = await splt.deriveAssociatedAddress(
            walletAddress,
            srcMintAddress,
          )
          const dstAddress = await splt.deriveAssociatedAddress(
            walletAddress,
            dstMintAddress,
          )
          return {
            poolAddress: poolAddress,
            srcAddress: srcAddress,
            dstAddress: dstAddress,
          }
        },
      ),
    )
    // Compute limit
    const {
      srcMintInfo: { decimals: bidDecimals },
    } = hops[0]
    const bidAmount = utils.decimalize(bidData.amount, bidDecimals)
    const {
      dstMintInfo: { decimals: askDecimals },
    } = hops[hops.length - 1]
    const askAmount = utils.decimalize(askData.amount, askDecimals)
    const limit =
      (askAmount * (DECIMALS - utils.decimalize(slippage, 9))) / DECIMALS
    // Execute swap
    return await swap.route(bidAmount, limit, routingAddresses, wallet)
  }, [hops, bidData, askData, slippage, walletAddress])

  const handleWrapSol = async () => {
    if (!wrapAmount) return
    const { swap, wallet } = window.sentre
    if (!wallet) return
    return await swap.wrapSol(wrapAmount, wallet)
  }

  const onSwap = async () => {
    try {
      setLoading(true)
      await handleWrapSol()
      const { txId } = (await handleSwap()) || {}
      window.notify({
        type: 'success',
        description: `Swap successfully. Click to view details.`,
        onClick: () => window.open(explorer(txId || ''), '_blank'),
      })
      return onCallback()
    } catch (er: any) {
      return window.notify({ type: 'error', description: er.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="primary"
      onClick={onSwap}
      disabled={disabled}
      loading={loading}
      block
    >
      Swap
    </Button>
  )
}

export default SwapButton
