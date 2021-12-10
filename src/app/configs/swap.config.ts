import { Net } from 'shared/runtime'

/**
 * Contructor
 */
type Conf = {
  bidDefault: string
  askDefault: string
}

const conf: Record<Net, Conf> = {
  /**
   * Development configurations
   */
  devnet: {
    bidDefault: '2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj',
    askDefault: '5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ',
  },

  /**
   * Staging configurations
   */
  testnet: {
    bidDefault: '',
    askDefault: '',
  },

  /**
   * Production configurations
   */
  mainnet: {
    bidDefault: '',
    askDefault: '',
  },
}

/**
 * Module exports
 */
export default conf
