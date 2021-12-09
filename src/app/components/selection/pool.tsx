import { useCallback, useEffect, useState } from 'react'
import { account, PoolData, utils } from '@senswap/sen-js'
import { TokenInfo } from '@solana/spl-token-registry'

import { Space, Avatar, Typography, Card, Divider, Tooltip } from 'antd'
import { useMint } from 'senhub/providers'
import { fetchCGK } from 'shared/helper'
import { numeric } from 'shared/util'
import IonIcon from 'shared/ionicon'

const Pool = ({
  value,
  onClick,
  active = false,
}: {
  value: PoolData | undefined
  onClick: () => void
  active?: boolean
}) => {
  const [tvl, setTVL] = useState(0)
  const [tokenInfos, setTokenInfos] = useState<Array<TokenInfo | any>>([
    {},
    {},
    {},
  ])
  const { tokenProvider } = useMint()

  // Get in-pool token info
  const getTokenInfos = useCallback(async () => {
    const { mint_a, mint_b } = value || {}
    const tokenInfos = await Promise.all(
      [mint_a, mint_b].map((mintAddress) => {
        if (!account.isAddress(mintAddress)) return {}
        return tokenProvider.findByAddress(mintAddress)
      }),
    )
    const formatTokenInfos = tokenInfos.map((token) => token || {})
    return setTokenInfos(formatTokenInfos)
  }, [value, tokenProvider])
  // Compute total locked value
  const getTVL = useCallback(async () => {
    const { reserve_a, reserve_b } = value || {}
    const reserves = [reserve_a, reserve_b]
    const decimals = tokenInfos.map(({ decimals }) => decimals)
    const data = await Promise.all(
      tokenInfos.map(({ extensions }) => {
        if (!extensions?.coingeckoId) return {} as any
        return fetchCGK(extensions?.coingeckoId)
      }),
    )
    const prices = data.map(({ price }) => price)
    let tvl = 0
    ;[0, 1, 2].forEach((i) => {
      if (reserves[i] && decimals[i] && prices[i])
        tvl =
          tvl +
          Number(utils.undecimalize(reserves[i] as bigint, decimals[i])) *
            prices[i]
    })
    return setTVL(tvl)
  }, [tokenInfos, value])

  useEffect(() => {
    getTokenInfos()
  }, [getTokenInfos])
  useEffect(() => {
    getTVL()
  }, [getTVL])

  return (
    <Card
      bodyStyle={{ padding: `8px 12px`, cursor: 'pointer', lineHeight: 1 }}
      bordered={active}
      onClick={onClick}
      hoverable
    >
      <Space size={12} style={{ fontSize: 12 }}>
        <Avatar.Group style={{ marginTop: 4, marginBottom: 4 }}>
          {tokenInfos.map(({ address, logoURI }, i) => (
            <Avatar
              key={address + i}
              src={logoURI}
              size={32}
              style={{ backgroundColor: '#2D3355', border: 'none' }}
            >
              <IonIcon name="diamond-outline" />
            </Avatar>
          ))}
        </Avatar.Group>
        <Typography.Text>
          {tokenInfos.map(({ symbol }) => symbol).join(' • ')}
        </Typography.Text>
        <Divider type="vertical" style={{ margin: 0 }} />
        <Space size={6}>
          <Tooltip title="The TVL here is roughly estimated and perhaps inaccurate because unknown tokens ain't involved in the computation.">
            <Space size={4}>
              <Typography.Text type="secondary">
                <IonIcon name="information-circle-outline" />
              </Typography.Text>
              <Typography.Text type="secondary">TVL:</Typography.Text>
            </Space>
          </Tooltip>
          <Typography.Text>${numeric(tvl).format('0.[00]a')}</Typography.Text>
        </Space>
      </Space>
    </Card>
  )
}

export default Pool
