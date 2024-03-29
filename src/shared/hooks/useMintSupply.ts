import { useCallback, useEffect, useState } from 'react'
import { useGetMintData } from '@sentre/senhub'
import BN from 'bn.js'

/**
 * Get token's total supply. This hook needs MintProvider for working.
 * MintProvider Ref: https://docs.sentre.io/senhub/development/providers/mint-provider
 * @param mintAddress Mint address
 * @returns Decimals
 */
const useMintSupply = (mintAddress: string) => {
  const [supply, setSupply] = useState<BN | undefined>(undefined)
  const getMint = useGetMintData()

  const fetchSupply = useCallback(async () => {
    try {
      const supply = await getMint({ mintAddress }).then((data) => {
        if (data) return data[mintAddress].supply
        return BigInt(0)
      })

      return setSupply(new BN(supply.toString()))
    } catch (er: any) {
      return setSupply(undefined)
    }
  }, [mintAddress, getMint])

  useEffect(() => {
    fetchSupply()
  }, [fetchSupply])

  return supply
}

export default useMintSupply
