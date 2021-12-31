import TokenProvider from 'os/providers/tokenProvider'
import { fetchCGK } from 'shared/util'
import axios from 'axios'

export interface MintInfo {
  address: string
  symbol: string
  price: number
  decimals: number
}

export type ChartParamsCGK = {
  days: number
  interval: string
}

const DEFAULT_TOKEN_INFO = {
  address: '',
  chainId: 0,
  decimals: 0,
  name: '',
  symbol: 'TOKEN',
  extensions: undefined,
  logoURI: '',
  tags: [],
}

const TOKEN_PROVIDER = new TokenProvider()

const cgk = {
  getMintInfos: async (mintsAddress: string[]) => {
    if (!TOKEN_PROVIDER || !mintsAddress) return
    const promise = mintsAddress.map(async (mint) => {
      let tokenInfo = await TOKEN_PROVIDER.findByAddress(mint)
      if (!tokenInfo) tokenInfo = DEFAULT_TOKEN_INFO
      const { address, symbol, decimals, extensions } = tokenInfo
      const ticket = extensions?.coingeckoId

      if (!ticket) return { address, symbol, decimals, price: 0 } // some mints don't have a ticket, so the price in cgk is 0

      const { price } = await fetchCGK(ticket)
      return { address, symbol, decimals, price }
    })
    const mintsDetails = await Promise.all(promise)
    const mapMintsDetails = new Map<string, MintInfo>()
    mintsDetails.forEach((mint) => {
      mapMintsDetails.set(mint.address, mint)
    })
    return mapMintsDetails
  },
}
export default cgk

export const fetchMarketChart = async (
  ticket: string,
  params: ChartParamsCGK,
) => {
  try {
    const data: any = await axios({
      method: 'get',
      url: `https://api.coingecko.com/api/v3/coins/${ticket}/market_chart?vs_currency=usd&days=${params.days}&interval=${params.interval}`,
    })
    const priceData: [number /*time*/, number /*price*/][] = data.data.prices
    return priceData.map((data) => ({ time: data[0], val: data[1] }))
  } catch (error) {
    return []
  }
}
