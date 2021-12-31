import { useCallback, useEffect, useState } from 'react'
import { account } from '@senswap/sen-js'

import { useMint, usePool } from 'senhub/providers'

const MintSymbol = ({
  mintAddress,
  separator = ' • ',
  isReverse = false,
}: {
  mintAddress: string
  separator?: string
  isReverse?: boolean
}) => {
  const [symbol, setSymbol] = useState('')
  const { tokenProvider } = useMint()
  const { pools } = usePool()

  const deriveSymbol = useCallback(
    async (address: string) => {
      const token = await tokenProvider.findByAddress(address)
      if (token?.symbol) return token.symbol
      return address.substring(0, 4)
    },
    [tokenProvider],
  )

  const deriveSymbols = useCallback(async () => {
    if (!account.isAddress(mintAddress)) return setSymbol('')
    // LP mint
    const poolData = Object.values(pools).find(
      ({ mint_lpt }) => mint_lpt === mintAddress,
    )
    if (poolData) {
      const { mint_a, mint_b } = poolData
      const symbols = await Promise.all([mint_a, mint_b].map(deriveSymbol))
      if (isReverse) symbols.reverse()
      return setSymbol(symbols.join(separator))
    }
    // Normal mint
    const symbol = await deriveSymbol(mintAddress)
    return setSymbol(symbol)
  }, [mintAddress, isReverse, deriveSymbol, pools, separator])

  useEffect(() => {
    deriveSymbols()
  }, [deriveSymbols])

  return <span>{symbol}</span>
}

export default MintSymbol
