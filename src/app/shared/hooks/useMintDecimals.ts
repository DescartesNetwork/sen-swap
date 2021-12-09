import { useCallback, useEffect, useState } from 'react'
import { useMint } from 'senhub/providers'

const useMintDecimals = (mintAddress: string): number => {
  const [decimals, setDecimals] = useState(0)
  const { tokenProvider, getMint } = useMint()

  const fetchTokenDecimals = useCallback(async () => {
    if (!mintAddress) return setDecimals(0)
    // Find in token provider
    const token = await tokenProvider.findByAddress(mintAddress)
    if (token) return setDecimals(token.decimals)
    // Find on blockchain (slow than token provider)
    try {
      const mint = await getMint({ address: mintAddress })
      return setDecimals(mint[mintAddress].decimals)
    } catch (error) {}
    return setDecimals(0)
  }, [getMint, mintAddress, tokenProvider])

  useEffect(() => {
    fetchTokenDecimals()
  }, [fetchTokenDecimals])

  return decimals
}

export default useMintDecimals
