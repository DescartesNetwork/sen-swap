import { Net } from 'shared/runtime'

/**
 * Contructor
 */
type Conf = {
  node: string
  cluster: 'devnet' | 'testnet' | 'mainnet-beta'
  spltAddress: string
  splataAddress: string
  swapAddress: string
  statNode: string
}

const conf: Record<Net, Conf> = {
  /**
   * Development configurations
   */
  devnet: {
    node: 'https://api.devnet.solana.com',
    cluster: 'devnet',
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    swapAddress: '4erFSLP7oBFSVC1t35jdxmbfxEhYCKfoM6XdG2BLR3UF',
    statNode: 'https://api.devnet.solana.com',
  },

  /**
   * Staging configurations
   */
  testnet: {
    node: 'https://api.testnet.solana.com',
    cluster: 'testnet',
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    swapAddress: '',
    statNode: 'https://api.testnet.solana.com',
  },

  /**
   * Production configurations
   */
  mainnet: {
    node: 'https://solana-api.projectserum.com',
    cluster: 'mainnet-beta',
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    swapAddress: 'SSW7ooZ1EbEognq5GosbygA3uWW1Hq1NsFq6TsftCFV',
    statNode: 'https://free.rpcpool.com',
  },
}

/**
 * Module exports
 */
export default conf
