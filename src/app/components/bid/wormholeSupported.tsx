import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { Space, Tag, Typography } from 'antd'

import { AppState } from 'app/model'
import { checkAttestedWormhole } from 'app/helper/wormhole'
import { randomColor } from 'shared/util'

const WORMHOLE_COLOR = '#F9575E'

const WormholeSupported = () => {
  const [wormholeSupported, setWormholeSupported] = useState(false)
  const {
    bid: { mintInfo },
  } = useSelector((state: AppState) => state)

  useEffect(() => {
    ;(async () => {
      const { address: mintAddress } = mintInfo || {}
      if (!account.isAddress(mintAddress)) return setWormholeSupported(false)
      const wormholeSupported = await checkAttestedWormhole(mintAddress)
      return setWormholeSupported(wormholeSupported)
    })()
  }, [mintInfo])

  if (!wormholeSupported) return null
  return (
    <Space size={4}>
      <Tag
        style={{
          margin: 0,
          borderRadius: 4,
          color: randomColor(WORMHOLE_COLOR),
        }}
        color={randomColor(WORMHOLE_COLOR, 0.2)}
      >
        Wormhole Bridge
      </Tag>
      <Typography.Text type="secondary">Supported</Typography.Text>
    </Space>
  )
}

export default WormholeSupported
