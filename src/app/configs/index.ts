import { env, net } from 'shared/runtime'
import manifest from './manifest.config'
import sol from './sol.config'
import swap from './swap.config'
import wormhole from './wormhole.config'
import route from './route.config'

const configs = {
  manifest: manifest[env],
  sol: sol[net],
  swap: swap[net],
  wormhole: wormhole[net],
  route: route[net],
}

/**
 * Module exports
 */
export default configs
