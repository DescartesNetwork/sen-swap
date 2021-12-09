import { useCallback, useEffect, useState } from 'react'
import { useMint } from 'senhub/providers'
import { fetchCGK } from 'shared/helper'

const DEFAULT_DATA = {
  address: '',
  icon: '',
  name: 'TOKEN',
  price: 0,
  priceChange: 0,
  rank: 0,
  symbol: 'TOKEN',
  totalVolume: 0,
}

const useMintCgk = (mintAddress: string): CgkData => {
  const [cgkData, setCgkData] = useState<CgkData>(DEFAULT_DATA)
  const { tokenProvider } = useMint()

  const fetchCgkData = useCallback(async () => {
    try {
      const token = await tokenProvider.findByAddress(mintAddress)
      const ticket = token?.extensions?.coingeckoId
      const cgkData = await fetchCGK(ticket)
      return setCgkData(cgkData)
    } catch (error) {
      return setCgkData(DEFAULT_DATA)
    }
  }, [mintAddress, tokenProvider])

  useEffect(() => {
    fetchCgkData()
  }, [fetchCgkData])

  return cgkData
}
export default useMintCgk
