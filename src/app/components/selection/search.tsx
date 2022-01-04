import React, { useCallback, useEffect, useState } from 'react'

import { Card, Input, Button } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { useMint } from 'senhub/providers'

const KEYSIZE = 3

const Search = ({
  onChange,
  isSupportedMint,
  disabled = false,
}: {
  onChange: (data: string[] | undefined) => void
  isSupportedMint: (mintAddress: string) => boolean
  disabled?: boolean
}) => {
  const [keyword, setKeyword] = useState('')
  const { tokenProvider } = useMint()

  const search = useCallback(async () => {
    if (!keyword || keyword.length < KEYSIZE) return onChange(undefined)
    const raw = await tokenProvider.find(keyword)
    const data = raw
      .filter(({ address }) => isSupportedMint(address))
      .map(({ address }) => address)
    return onChange(data)
  }, [keyword, tokenProvider, onChange, isSupportedMint])

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
