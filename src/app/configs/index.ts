import { env, net } from 'shared/runtime'
import manifest from './manifest.config'
import sol from './sol.config'
import swap from './swap.config'
import wormhole from './wormhole.config'

const configs = {
  manifest: manifest[env],
  sol: sol[net],
  swap: swap[net],
  wormhole: wormhole[net],
}

/**
 * Module exports
 */
export default configs
