import { Net } from '@sentre/senhub'

/**
 * Contructor
 */
type Config = {
  assetsRoute: string
}

const config: Record<Net, Config> = {
  /**
   * Development configurations
   */
  devnet: {
    assetsRoute: '/app/sen_assets',
  },

  /**
   * Staging configurations
   */
  testnet: {
    assetsRoute: '/app/sen_assets',
  },

  /**
   * Production configurations
   */
  mainnet: {
    assetsRoute: '/app/sen_assets',
  },
}

export default config
