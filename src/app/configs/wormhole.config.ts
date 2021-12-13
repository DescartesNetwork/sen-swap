import { Net } from 'shared/runtime'

/**
 * Contructor
 */
type Conf = {
  wormholeAddress: string
}

const conf: Record<Net, Conf> = {
  /**
   * Development configurations
   */
  devnet: {
    wormholeAddress: 'rRsXLHe7sBHdyKU3KY3wbcgWvoT1Ntqudf6e9PKusgb',
  },

  /**
   * Staging configurations
   */
  testnet: {
    wormholeAddress: 'rRsXLHe7sBHdyKU3KY3wbcgWvoT1Ntqudf6e9PKusgb',
  },

  /**
   * Production configurations
   */
  mainnet: {
    wormholeAddress: 'rRsXLHe7sBHdyKU3KY3wbcgWvoT1Ntqudf6e9PKusgb',
  },
}

/**
 * Module exports
 */
export default conf
