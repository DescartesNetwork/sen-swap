import { useState, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { TokenInfo } from '@solana/spl-token-registry'
import { account } from '@senswap/sen-js'
import LazyLoad from 'react-lazyload'

import { Row, Col, Typography, Button } from 'antd'
import Search from './search'
import Mint from './mint'
import Pool from './pool'

import { AppState } from 'app/model'
import { extractReserve, pointSorting } from 'app/helper/router'
import IonIcon from 'shared/ionicon'
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
  const [tempTokenInfo, setTempTokenInfo] = useState<TokenInfo>()
  const [mints, setMints] = useState<Array<TokenInfo>>([])
  const settings = useSelector((state: AppState) => state.settings)
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
  // Auto pool selection
  const onAuto = useCallback(() => {
    const poolAddresses = getAvailablePoolAddresses(tempTokenInfo)
    return onChange({
      mintInfo: tempTokenInfo,
      poolAddress: undefined,
      poolAddresses,
    })
  }, [getAvailablePoolAddresses, tempTokenInfo, onChange])

  /**
   * Render mint list
   */
  const mintList = useMemo(() => {
    // Return data to parent (users didn't select pool)
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
                  advanced={settings.advanced}
                  onAdvanced={() => setTempTokenInfo(mint)}
                  active={currentMintAddress === address}
                />
              </LazyLoad>
            </Col>
          )
        })}
      </Row>
    )
  }, [getAvailablePoolAddresses, onChange, mints, value, settings.advanced])

  /**
   * Render pool list
   */
  const poolList = useMemo(() => {
    // Return data to parent (users specified a pool)
    const onPool = (poolAddress: string) => {
      const poolAddresses = getAvailablePoolAddresses(tempTokenInfo)
      return onChange({
        mintInfo: tempTokenInfo,
        poolAddress,
        poolAddresses,
      })
    }
    return (
      <Row gutter={[16, 16]}>
        {getAvailablePoolAddresses(tempTokenInfo)
          .map((poolAddress) => ({
            address: poolAddress,
            ...pools[poolAddress],
          }))
          .map(({ address, ...poolData }) => {
            const { address: mintAddress } = tempTokenInfo || {}
            return {
              address,
              point: extractReserve(mintAddress as string, poolData),
            }
          })
          .sort(pointSorting)
          .map(({ address: poolAddress }, i) => {
            const { poolAddress: currentPoolAddress } = value
            const poolData = pools[poolAddress]
            return (
              <Col span={24} key={poolAddress + i}>
                <LazyLoad height={56} overflow>
                  <Pool
                    value={poolData}
                    onClick={() => onPool(poolAddress)}
                    active={poolAddress === currentPoolAddress}
                  />
                </LazyLoad>
              </Col>
            )
          })}
      </Row>
    )
  }, [getAvailablePoolAddresses, tempTokenInfo, pools, onChange, value])

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={5}>Token Selection</Typography.Title>
      </Col>
      <Col span={24}>
        <Search
          onChange={onMints}
          isSupportedMint={isSupportedMint}
          disabled={Boolean(tempTokenInfo)}
        />
      </Col>
      <Col span={24}>
        <Row gutter={[16, 16]} style={{ height: 300, overflow: 'auto' }}>
          {tempTokenInfo ? (
            <Col span={24}>
              <Row gutter={[8, 8]} wrap={false} align="middle">
                <Col flex="auto">
                  <Button
                    type="text"
                    className="contained"
                    icon={<IonIcon name="arrow-back-outline" />}
                    onClick={() => setTempTokenInfo(undefined)}
                  >
                    Back
                  </Button>
                </Col>
                <Col>
                  <Typography.Text type="secondary">
                    Choose one favorite pool or
                  </Typography.Text>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    icon={<IonIcon name="sparkles-outline" />}
                    onClick={onAuto}
                  >
                    Auto
                  </Button>
                </Col>
              </Row>
            </Col>
          ) : null}
          <Col span={24}>{!tempTokenInfo ? mintList : poolList}</Col>
          <Col span={24} />
        </Row>
      </Col>
    </Row>
  )
}

export default MintSelection
