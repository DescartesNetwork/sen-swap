import {
  CHAIN_ID_ETH,
  CHAIN_ID_SOLANA,
  getForeignAssetEth,
  getOriginalAssetSol,
} from '@certusone/wormhole-sdk'
import storage from 'shared/storage'
import { ethers } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'

import {
  EtherNetwork,
  ETH_BRIDGE_ADDRESS,
  ETH_TOKEN_BRIDGE_ADDRESS,
} from 'app/constant/ethConfig'
import {
  SolNetWork,
  SOL_BRIDGE_ADDRESS,
  SOL_TOKEN_BRIDGE_ADDRESS,
} from 'app/constant/solConfig'

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
  const detectedProvider: any = await detectEthereumProvider()
  if (!detectedProvider) return false
  const provider = new ethers.providers.Web3Provider(detectedProvider, 'any')

  const etherContext = getEtherContext()
  const solContext = getSolContext()
  const originAsset = await getOriginalAssetSol(
    window.sentre.splt.connection,
    solContext.tokenBridgeAddress,
    mintAddress,
  )
  const wrappedMintAddress = await getForeignAssetEth(
    etherContext.tokenBridgeAddress,
    provider,
    originAsset.chainId,
    originAsset.assetAddress,
  )
  return !!wrappedMintAddress
}
