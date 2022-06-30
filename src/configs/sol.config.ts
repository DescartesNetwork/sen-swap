import { Net } from '@sentre/senhub'

/**
 * Contructor
 */
type Conf = {
  cluster: 'devnet' | 'testnet' | 'mainnet-beta'
  spltAddress: string
  splataAddress: string
  swapAddress: string
}

const conf: Record<Net, Conf> = {
  /**
   * Development configurations
   */
  devnet: {
    cluster: 'devnet',
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    swapAddress: '4erFSLP7oBFSVC1t35jdxmbfxEhYCKfoM6XdG2BLR3UF',
  },

  /**
   * Staging configurations
   */
  testnet: {
    cluster: 'testnet',
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    swapAddress: '',
  },

  /**
   * Production configurations
   */
  mainnet: {
    cluster: 'mainnet-beta',
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    swapAddress: 'SSW7ooZ1EbEognq5GosbygA3uWW1Hq1NsFq6TsftCFV',
  },
}

/**
 * Module exports
 */
export default conf
