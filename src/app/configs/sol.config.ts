import { Net } from 'shared/runtime'

/**
 * Contructor
 */
type Conf = {
  node: string
  cluster: 'devnet' | 'testnet' | 'mainnet-beta'
  spltAddress: string
  splataAddress: string
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
  },

  /**
   * Staging configurations
   */
  testnet: {
    node: 'https://api.testnet.solana.com',
    cluster: 'testnet',
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  },

  /**
   * Production configurations
   */
  mainnet: {
    node: 'https://solana-api.projectserum.com',
    cluster: 'mainnet-beta',
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  },
}

/**
 * Module exports
 */
export default conf
