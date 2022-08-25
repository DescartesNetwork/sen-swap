import { lazy, Suspense, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Popover, Tag } from 'antd'

import { AppState } from 'model'
import { checkAttestedWormhole } from 'helper/wormhole'
import { util } from '@sentre/senhub'

const WORMHOLE_COLOR = '#F9575E'

const FrameWormhole = () => {
  const FrameWormhole = lazy(() =>
    // @ts-ignore
    import('@frame/sen_assets/bootstrap').then((module) => ({
      default: module.FrameWormhole,
    })),
  )
  return (
    <Suspense fallback="Loading...">
      <FrameWormhole />
    </Suspense>
  )
}

const WormholeSupported = () => {
  const [wormholeSupported, setWormholeSupported] = useState(false)
  const {
    bid: { mintInfo },
  } = useSelector((state: AppState) => state)
  const { address: mintAddress } = mintInfo || {}

  useEffect(() => {
    ;(async () => {
      if (!util.isAddress(mintAddress)) return setWormholeSupported(false)
      const wormholeSupported = await checkAttestedWormhole(mintAddress)
      return setWormholeSupported(wormholeSupported)
    })()
  }, [mintAddress])

  if (!wormholeSupported) return null
  return (
    <Popover
      overlayInnerStyle={{
        background: 'transparent',
        width: 375,
        boxShadow: 'none',
      }}
      trigger="click"
      content={<FrameWormhole />}
    >
      <Tag
        style={{
          margin: 0,
          borderRadius: 4,
          color: util.randomColor(WORMHOLE_COLOR),
          cursor: 'pointer',
        }}
        color={util.randomColor(WORMHOLE_COLOR, 0.2)}
      >
        Wormhole Bridge
      </Tag>
    </Popover>
  )
}

export default WormholeSupported
