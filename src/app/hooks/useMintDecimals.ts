import { useCallback, useEffect, useState } from 'react'
import { useMint } from 'senhub/providers'

const useMintDecimals = (mintAddress: string): number => {
  const [decimals, setDecimals] = useState(0)
  const { getDecimals } = useMint()

  const fetchDecimals = useCallback(async () => {
    try {
      const decimals = await getDecimals(mintAddress)
      return setDecimals(decimals)
    } catch (er: any) {
      return setDecimals(0)
    }
  }, [mintAddress, getDecimals])

  useEffect(() => {
    fetchDecimals()
  }, [fetchDecimals])

  return decimals
}

export default useMintDecimals
