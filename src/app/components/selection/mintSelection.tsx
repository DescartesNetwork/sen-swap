import { useState, useCallback, useMemo } from 'react'
import { account } from '@senswap/sen-js'
import LazyLoad from '@senswap/react-lazyload'

import { Row, Col, Typography, Divider } from 'antd'
import Search from './search'
import Mint from './mint'

import { useMint, usePool } from 'senhub/providers'
import { LiteMintInfo } from '../preview'

export type SelectionInfo = {
  mintInfo?: LiteMintInfo
  poolAddress?: string
  poolAddresses: string[]
}

const MintSelection = ({
  value,
  onChange,
}: {
  value: SelectionInfo
  onChange: (value: SelectionInfo) => void
}) => {
  const [mintAddresses, setMintAddresses] = useState<string[]>([])
  const { pools } = usePool()
  const { getDecimals } = useMint()

  // Compute mints that appear in all pools
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
  // Compoute mint list
  const onMints = useCallback(
    async (value: string[] | undefined) => {
      if (value) return setMintAddresses(value)
      return setMintAddresses(supportedMintAddresses)
    },
    [supportedMintAddresses],
  )
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

  /**
   * Render mint list
   */
  const mintList = useMemo(() => {
    // Return data to parent
    const onMint = async (mintAddress: string) => {
      const poolAddresses = getAvailablePoolAddresses(mintAddress)
      const decimals = await getDecimals(mintAddress)
      return onChange({
        mintInfo: {
          address: mintAddress,
          decimals,
        },
        poolAddress: undefined,
        poolAddresses,
      })
    }
    return (
      <Row gutter={[16, 16]}>
        {mintAddresses.map((mintAddress, i) => {
          const { address: currentMintAddress } = value.mintInfo || {}
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
    )
  }, [getAvailablePoolAddresses, onChange, mintAddresses, value, getDecimals])

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={5}>Token Selection</Typography.Title>
      </Col>
      <Col span={24}>
        <Divider style={{ margin: 0 }} />
      </Col>
      <Col span={24}>
        <Search onChange={onMints} isSupportedMint={isSupportedMint} />
      </Col>
      <Col span={24}>
        <Row gutter={[16, 16]} style={{ height: 300, overflow: 'auto' }}>
          <Col span={24}>{mintList}</Col>
        </Row>
      </Col>
    </Row>
  )
}

export default MintSelection
