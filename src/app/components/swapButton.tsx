import { useCallback, useState } from 'react'
import { utils } from '@senswap/sen-js'
import { useSelector } from 'react-redux'

import { Button } from 'antd'
import { HopData } from './preview/index'
import { AppState } from 'app/model'
import { useWallet } from 'senhub/providers'
import { explorer } from 'shared/util'

const DECIMALS = BigInt(1000000000)

const SwapButton = ({
  hops,
  onCallback = () => {},
  disabled = false,
  wrapAmount = BigInt(0),
  hightImpact = false,
}: {
  hops: HopData[]
  onCallback?: () => void
  disabled?: boolean
  wrapAmount: bigint
  hightImpact?: boolean
}) => {
  const [loading, setLoading] = useState(false)
  const {
    bid: { amount: _bidAmount, mintInfo: bidMintInfo },
    ask: { amount: _askAmount, mintInfo: askMintInfo },
  } = useSelector((state: AppState) => state)
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
          srcMintAddress,
          dstMintAddress,
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
    const bidDecimals = bidMintInfo?.decimals || 0
    const bidAmount = utils.decimalize(_bidAmount, bidDecimals)
    const askDecimals = askMintInfo?.decimals || 0
    const askAmount = utils.decimalize(_askAmount, askDecimals)
    const limit =
      (askAmount * (DECIMALS - utils.decimalize(slippage, 9))) / DECIMALS
    // Execute swap
    return await swap.route(bidAmount, limit, routingAddresses, wallet)
  }, [
    hops,
    bidMintInfo,
    askMintInfo,
    slippage,
    walletAddress,
    _bidAmount,
    _askAmount,
  ])

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
      {hightImpact ? 'Too High Price Impact' : 'Swap'}
    </Button>
  )
}

export default SwapButton
