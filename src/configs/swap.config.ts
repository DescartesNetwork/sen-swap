import { Net } from '@sentre/senhub'

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
    bidDefault: '2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj',
    askDefault: '5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ',
  },

  /**
   * Production configurations
   */
  mainnet: {
    bidDefault: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    askDefault: 'SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M',
  },
}

/**
 * Module exports
 */
export default conf
