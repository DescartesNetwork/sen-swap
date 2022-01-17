import React, { useCallback, useEffect, useState } from 'react'
import { useMint, usePool } from '@senhub/providers'

import { Card, Input, Button } from 'antd'
import IonIcon from 'shared/antd/ionicon'

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

  const sortMintAddresses = useCallback(async () => {
    // Get all mints in token provider
    const allMintAddresses = (await tokenProvider.all()).map(
      ({ address }) => address,
    )
    // Get all mints in pools
    const inPoolMintAddresses = Object.values(pools)
      .map(({ mint_a, mint_b }) => [mint_a, mint_b])
      .flat()
      .filter((item, pos, self) => self.indexOf(item) === pos)
    // Check mint addresses (token info, mint lp)
    inPoolMintAddresses.forEach((mintAddress) => {
      if (!allMintAddresses.includes(mintAddress))
        allMintAddresses.push(mintAddress)
    })
    // Return
    return setMintAddresses(allMintAddresses)
  }, [tokenProvider, pools])

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
