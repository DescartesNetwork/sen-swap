import { Connection, PublicKey } from '@solana/web3.js'
import { JupiterProvider } from '@jup-ag/react-hook'
import { useWallet } from '@senhub/providers'

import SwapButton, { SwapButtonProps } from './swapButton'

import configs from 'app/configs'

const {
  sol: { node, cluster },
} = configs
const connection = new Connection(node)

const SwapAction = ({
  onCallback = () => {},
  forceSwap = false,
}: SwapButtonProps) => {
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  return (
    <JupiterProvider
      connection={connection}
      cluster={cluster}
      userPublicKey={new PublicKey(walletAddress)}
    >
      <SwapButton onCallback={onCallback} forceSwap={forceSwap} />
    </JupiterProvider>
  )
}

export default SwapAction
