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
    // Get all mints in pools
    const rawMintAddresses = Object.values(pools)
      .map(({ mint_a, mint_b }) => [mint_a, mint_b])
      .flat()
      .filter((item, pos, self) => self.indexOf(item) === pos)
    // Get all lp mints
    const lpMintAddresses = Object.values(pools).map(({ mint_lpt }) => mint_lpt)
    // Check mint addresses (token info, mint lp)
    const checkedMintAddresses = await Promise.all(
      rawMintAddresses.map(async (mintAddress) => {
        const tokenInfo = await tokenProvider.findByAddress(mintAddress)
        const data = {
          address: mintAddress,
          checked: Boolean(tokenInfo) || lpMintAddresses.includes(mintAddress),
        }
        return data
      }),
    )
    // Sort mint addresses by checking flags
    const sortedMintAddresses = checkedMintAddresses
      .sort((first, second) => {
        if (!first.checked && second.checked) return 1
        if (first.checked && !second.checked) return -1
        return 0
      })
      .map(({ address }) => address)
    // Return
    return setMintAddresses(sortedMintAddresses)
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
