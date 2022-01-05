import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { Card, Input, Button } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { useMint, usePool } from 'senhub/providers'

const KEYSIZE = 3

const Search = ({
  onChange,
  disabled = false,
}: {
  onChange: (data: string[]) => void
  disabled?: boolean
}) => {
  const [keyword, setKeyword] = useState('')
  const { tokenProvider } = useMint()
  const { pools } = usePool()

  const supportedMintAddresses = useMemo(() => {
    if (!pools) return []
    return Object.values(pools)
      .map(({ mint_a, mint_b }) => [mint_a, mint_b])
      .flat()
      .filter((item, pos, self) => self.indexOf(item) === pos)
  }, [pools])

  const isSupportedMint = useCallback(
    (mintAddress) => supportedMintAddresses.includes(mintAddress),
    [supportedMintAddresses],
  )

  const search = useCallback(async () => {
    if (!keyword || keyword.length < KEYSIZE)
      return onChange(supportedMintAddresses)
    const raw = await tokenProvider.find(keyword)
    const data = raw
      .filter(({ address }) => isSupportedMint(address))
      .map(({ address }) => address)
    // Search with address
    for (const mintAddr of supportedMintAddresses) {
      if (data.includes(mintAddr)) continue
      if (!mintAddr.toLowerCase().includes(keyword.toLowerCase())) continue
      data.push(mintAddr)
    }
    return onChange(data)
  }, [
    keyword,
    onChange,
    tokenProvider,
    isSupportedMint,
    supportedMintAddresses,
  ])

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
