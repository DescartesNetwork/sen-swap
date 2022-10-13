import { Net, rpc } from '@sentre/senhub'
import { Swap } from '@senswap/sen-js'

/**
 * Contructor
 */
type Conf = {
  cluster: 'devnet' | 'testnet' | 'mainnet-beta'
  spltAddress: string
  splataAddress: string
  swapAddress: string
  taxmanAddress: string
  swap: Swap
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
    taxmanAddress: '8UaZw2jDhJzv5V53569JbCd3bD4BnyCfBH3sjwgajGS9',
    get swap() {
      return new Swap(
        this.swapAddress,
        this.spltAddress,
        this.splataAddress,
        rpc,
      )
    },
  },

  /**
   * Staging configurations
   */
  testnet: {
    cluster: 'testnet',
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    swapAddress: '',
    taxmanAddress: '',
    get swap() {
      return new Swap(
        this.swapAddress,
        this.spltAddress,
        this.splataAddress,
        rpc,
      )
    },
  },

  /**
   * Production configurations
   */
  mainnet: {
    cluster: 'mainnet-beta',
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    swapAddress: 'SSW7ooZ1EbEognq5GosbygA3uWW1Hq1NsFq6TsftCFV',
    taxmanAddress: '9doo2HZQEmh2NgfT3Yx12M89aoBheycYqH1eaR5gKb3e',
    get swap() {
      return new Swap(
        this.swapAddress,
        this.spltAddress,
        this.splataAddress,
        rpc,
      )
    },
  },
}

/**
 * Module exports
 */
export default conf
