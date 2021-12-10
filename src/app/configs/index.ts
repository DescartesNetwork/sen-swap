import { env, net } from 'shared/runtime'
import manifest from './manifest.config'
import sol from './sol.config'
import swap from './swap.config'

const configs = {
  manifest: manifest[env],
  sol: sol[net],
  swap: swap[net]
}

/**
 * Module exports
 */
export default configs
