import { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { Divider, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import PoweredByJupiter from '../poweredByJupiter'

import { AppState } from 'app/model'
import { account } from '@senswap/sen-js'
import { MintAvatar } from 'shared/antd/mint'
import { SwapPlatform } from 'app/model/route.controller'

const RouteAvatar = () => {
  const {
    bid: { mintInfo },
    route: { platform, best },
  } = useSelector((state: AppState) => state)

  const srcMintAddress = mintInfo?.address
  const chainMintAddresses = useMemo(() => {
    if (!best.length || !account.isAddress(srcMintAddress)) return []
    let list = [srcMintAddress]
    for (const hop of best) {
      const { dstMintAddress } = hop
      if (account.isAddress(dstMintAddress)) list.push(dstMintAddress)
    }
    return list
  }, [srcMintAddress, best])

  return (
    <Space>
      {chainMintAddresses?.map((mintAddress, i) => (
        <Fragment key={i}>
          <MintAvatar mintAddress={mintAddress} />
          {chainMintAddresses.length > i + 1 && (
            <IonIcon name="chevron-forward-outline" />
          )}
        </Fragment>
      ))}
      {platform === SwapPlatform.JupiterAggregator && (
        <Fragment>
          <Divider type="vertical" style={{ margin: 0 }} />
          <PoweredByJupiter />
        </Fragment>
      )}
    </Space>
  )
}
export default RouteAvatar
