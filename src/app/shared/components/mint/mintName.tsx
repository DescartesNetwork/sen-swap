import { useMemo } from 'react'

import useTokenProvider from 'app/shared/hooks/useTokenProvider'
import { shortenAddress } from 'shared/util'

const MintName = ({ mintAddress }: { mintAddress: string }) => {
  const tokens = useTokenProvider(mintAddress)

  const names = useMemo(() => {
    let names = tokens
      .map((token) => {
        if (!token) return shortenAddress(mintAddress)
        const { name, address, symbol } = token
        if (tokens.length === 1 && name) return name
        if (symbol) return symbol
        return shortenAddress(address)
      })
      .join(' / ')
    //Normal token
    if (tokens.length === 1) return names
    //LPT token
    return `${names} LPT`
  }, [mintAddress, tokens])
  return <span>{names}</span>
}

export default MintName
