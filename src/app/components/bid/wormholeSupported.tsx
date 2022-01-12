import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { account } from '@senswap/sen-js'

import { Space, Tag, Typography } from 'antd'

import { AppState } from 'app/model'
import { checkAttestedWormhole } from 'app/helper/wormhole'
import { randomColor } from 'shared/util'
import configs from 'app/configs'

const WORMHOLE_COLOR = '#F9575E'

const {
  route: { assetsRoute },
} = configs

const WormholeSupported = () => {
  const [wormholeSupported, setWormholeSupported] = useState(false)
  const history = useHistory()
  const {
    bid: { mintInfo },
  } = useSelector((state: AppState) => state)
  const query = new URLSearchParams(useLocation().search)
  const { address: mintAddress } = mintInfo || {}

  useEffect(() => {
    ;(async () => {
      if (!account.isAddress(mintAddress)) return setWormholeSupported(false)
      const wormholeSupported = await checkAttestedWormhole(mintAddress)
      return setWormholeSupported(wormholeSupported)
    })()
  }, [mintAddress])

  const wormholeBridge = () => {
    query.set('tokenAddress', mintAddress)
    history.push(`${assetsRoute}?` + query.toString())
  }

  if (!wormholeSupported) return null
  return (
    <Space size={4}>
      <Tag
        style={{
          margin: 0,
          borderRadius: 4,
          color: randomColor(WORMHOLE_COLOR),
          cursor: 'pointer',
        }}
        color={randomColor(WORMHOLE_COLOR, 0.2)}
        onClick={wormholeBridge}
      >
        Wormhole Bridge
      </Tag>
      <Typography.Text type="secondary">Supported</Typography.Text>
    </Space>
  )
}

export default WormholeSupported
