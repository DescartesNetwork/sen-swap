import { useState, useCallback } from 'react'
import { account } from '@senswap/sen-js'
import LazyLoad from '@senswap/react-lazyload'

import { Row, Col, Typography, Divider } from 'antd'
import Search from './search'
import Mint from './mint'

import { useMint, usePool } from 'senhub/providers'
import { LiteMintInfo } from '../preview'

export type SelectionInfo = {
  mintInfo?: LiteMintInfo
  poolAddresses: string[]
}

const MintSelection = ({
  value,
  onChange,
  hiddenTokens,
}: {
  value: SelectionInfo
  onChange: (value: SelectionInfo) => void
  hiddenTokens?: string[]
}) => {
  const [mintAddresses, setMintAddresses] = useState<string[]>([])
  const { address: currentMintAddress } = value.mintInfo || {}
  const { pools } = usePool()
  const { getDecimals } = useMint()

  // Compute available pools
  const getAvailablePoolAddresses = useCallback(
    (mintAddress: string) => {
      if (!account.isAddress(mintAddress)) return []
      return Object.keys(pools).filter((poolAddress) => {
        const { mint_a, mint_b } = pools[poolAddress]
        return [mint_a, mint_b].includes(mintAddress)
      })
    },
    [pools],
  )

  // Return data to parent
  const onMint = useCallback(
    async (mintAddress: string) => {
      const poolAddresses = getAvailablePoolAddresses(mintAddress)
      const decimals = await getDecimals(mintAddress)
      return onChange({
        mintInfo: {
          address: mintAddress,
          decimals,
        },
        poolAddresses,
      })
    },
    [getAvailablePoolAddresses, onChange, getDecimals],
  )

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={5}>Token Selection</Typography.Title>
      </Col>
      <Col span={24}>
        <Divider style={{ margin: 0 }} />
      </Col>
      <Col span={24}>
        <Search onChange={setMintAddresses} />
      </Col>
      <Col span={24}>
        <Row gutter={[16, 16]} style={{ height: 300, overflow: 'auto' }}>
          <Col span={24}>
            <Row gutter={[16, 16]}>
              {mintAddresses.map((mintAddress, i) => {
                if (hiddenTokens?.includes(mintAddress)) return null
                return (
                  <Col span={24} key={i}>
                    <LazyLoad height={48} overflow>
                      <Mint
                        mintAddress={mintAddress}
                        onClick={() => onMint(mintAddress)}
                        active={currentMintAddress === mintAddress}
                      />
                    </LazyLoad>
                  </Col>
                )
              })}
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default MintSelection
