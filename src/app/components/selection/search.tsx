import React, { useCallback, useEffect, useState } from 'react'
import { useAccount, useMint, usePool } from '@senhub/providers'

import { Card, Input, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

const KEYSIZE = 3

const Search = ({
  onChange,
  disabled = false,
}: {
  onChange: (data: string[]) => void
  disabled?: boolean
}) => {
  const [mintAddresses, setMintAddresses] = useState<string[]>([])
  const [keyword, setKeyword] = useState('')
  const { tokenProvider } = useMint()
  const { pools } = usePool()
  const { accounts } = useAccount()

  const sortMintAddresses = useCallback(async () => {
    let sortedMint: Record<string, boolean> = {}
    // Get all mints in token provider
    const allMintAddress: Record<string, boolean> = {}
    const allTokens = await tokenProvider.all()
    for (const token of allTokens) allMintAddress[token.address] = true

    // get all single token in accounts
    for (const addr in accounts) {
      const { mint, amount } = accounts[addr]
      if (allMintAddress[mint] && amount) sortedMint[mint] = true
    }
    sortedMint = { ...sortedMint, ...allMintAddress }

    // Get all mints in pools
    const inPoolMintAddresses = Object.values(pools)
      .map(({ mint_a, mint_b }) => [mint_a, mint_b])
      .flat()
      .filter((item, pos, self) => self.indexOf(item) === pos)
    // Check mint addresses (token info, mint lp)
    inPoolMintAddresses.forEach((mintAddress) => {
      if (!sortedMint[mintAddress]) sortedMint[mintAddress] = true
    })

    // Return
    return setMintAddresses(Object.keys(sortedMint))
  }, [tokenProvider, pools, accounts])

  useEffect(() => {
    sortMintAddresses()
  }, [sortMintAddresses])

  const search = useCallback(async () => {
    if (!keyword || keyword.length < KEYSIZE) return onChange(mintAddresses)
    const raw = await tokenProvider.find(keyword)
    const data = raw
      .filter(({ address }) => mintAddresses.includes(address))
      .map(({ address }) => address)
    // Search by address
    mintAddresses.forEach((mintAddress) => {
      if (data.includes(mintAddress)) return
      if (!mintAddress.toLowerCase().includes(keyword.toLowerCase())) return
      return data.push(mintAddress)
    })
    return onChange(data)
  }, [keyword, onChange, tokenProvider, mintAddresses])

  useEffect(() => {
    search()
  }, [search])

  return (
    <Card className="card-child" bodyStyle={{ padding: 8 }} bordered={false}>
      <Input
        placeholder="Search"
        value={keyword}
        size="small"
        bordered={false}
        suffix={
          <Button
            type="text"
            style={{ marginRight: -7 }}
            size="small"
            onClick={keyword ? () => setKeyword('') : () => {}}
            icon={
              <IonIcon name={keyword ? 'close-outline' : 'search-outline'} />
            }
            disabled={disabled}
          />
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setKeyword(e.target.value)
        }
        disabled={disabled}
      />
    </Card>
  )
}

export default Search
