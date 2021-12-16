import { useState, useCallback, useMemo } from 'react'
import { TokenInfo } from '@solana/spl-token-registry'
import { account } from '@senswap/sen-js'
import LazyLoad from 'react-lazyload'

import { Row, Col, Typography, Divider } from 'antd'
import Search from './search'
import Mint from './mint'

import { useMint, usePool } from 'senhub/providers'

export type SelectionInfo = {
  mintInfo?: TokenInfo
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
  const [mints, setMints] = useState<Array<TokenInfo>>([])
  const { pools } = usePool()
  const { tokenProvider } = useMint()

  // Compute mints that appear in all pools
  const supportedMints = useMemo(() => {
    if (!pools) return []
    return Object.keys(pools)
      .map((poolAddress) => {
        const { mint_a, mint_b } = pools[poolAddress]
        return [mint_a, mint_b]
      })
      .flat()
      .filter((item, pos, self) => self.indexOf(item) === pos)
  }, [pools])
  const isSupportedMint = useCallback(
    (mintAddress) => supportedMints.includes(mintAddress),
    [supportedMints],
  )
  // Compoute mint list
  const onMints = useCallback(
    async (value: null | Array<TokenInfo>) => {
      if (value) return setMints(value)
      const raw = await tokenProvider.all()
      const allMints = raw.filter(({ address }) => isSupportedMint(address))
      return setMints(allMints)
    },
    [tokenProvider, isSupportedMint],
  )
  // Compute available pools
  const getAvailablePoolAddresses = useCallback(
    (tokenInfo: TokenInfo | undefined) => {
      const mintAddress = tokenInfo?.address
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
    const onMint = (tokenInfo: TokenInfo) => {
      const poolAddresses = getAvailablePoolAddresses(tokenInfo)
      return onChange({
        mintInfo: tokenInfo,
        poolAddress: undefined,
        poolAddresses,
      })
    }
    return (
      <Row gutter={[16, 16]}>
        {mints.map((mint, i) => {
          const { logoURI, symbol, name, address } = mint
          const { address: currentMintAddress } = value.mintInfo || {}
          return (
            <Col span={24} key={name + i}>
              <LazyLoad height={48} overflow>
                <Mint
                  logoURI={logoURI}
                  symbol={symbol}
                  name={name}
                  onClick={() => onMint(mint)}
                  active={currentMintAddress === address}
                />
              </LazyLoad>
            </Col>
          )
        })}
      </Row>
    )
  }, [getAvailablePoolAddresses, onChange, mints, value])

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
          <Col span={24} />
        </Row>
      </Col>
    </Row>
  )
}

export default MintSelection
