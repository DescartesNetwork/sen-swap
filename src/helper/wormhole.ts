import { CHAIN_ID_ETH, CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'
import { storage, connection } from '@sentre/senhub'

import {
  EtherNetwork,
  ETH_BRIDGE_ADDRESS,
  ETH_TOKEN_BRIDGE_ADDRESS,
} from 'constant/ethConfig'
import {
  SolNetWork,
  SOL_BRIDGE_ADDRESS,
  SOL_TOKEN_BRIDGE_ADDRESS,
} from 'constant/solConfig'
import { getIsWrappedAssetSol } from '@certusone/wormhole-sdk'

export const getSolNetwork = () => {
  const solNetwork = storage.get('network') || 'mainnet'
  return solNetwork
}

export const getEtherNetwork = () => {
  const solNetwork = getSolNetwork()
  const etherNetwork = solNetwork === 'mainnet' ? 'mainnet' : 'goerli'
  return etherNetwork
}

export const getEtherContext = () => {
  const etherNetwork: EtherNetwork = getEtherNetwork()
  return {
    chainId: CHAIN_ID_ETH,
    tokenBridgeAddress: ETH_TOKEN_BRIDGE_ADDRESS[etherNetwork],
    bridgeAddress: ETH_BRIDGE_ADDRESS[etherNetwork],
  }
}

export const getSolContext = () => {
  const solNetWork: SolNetWork = getSolNetwork()
  return {
    chainId: CHAIN_ID_SOLANA,
    tokenBridgeAddress: SOL_TOKEN_BRIDGE_ADDRESS[solNetWork],
    bridgeAddress: SOL_BRIDGE_ADDRESS[solNetWork],
  }
}

export const checkAttestedWormhole = async (mintAddress: string) => {
  const solContext = getSolContext()
  return getIsWrappedAssetSol(
    connection,
    solContext.tokenBridgeAddress,
    mintAddress,
  )
}
