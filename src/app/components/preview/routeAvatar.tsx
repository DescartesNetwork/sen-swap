import { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { AppState } from 'app/model'
import { account } from '@senswap/sen-js'
import { MintAvatar } from 'shared/antd/mint'

const RouteAvatar = () => {
  const {
    bid: { mintInfo },
    route: { hops },
  } = useSelector((state: AppState) => state)

  const srcMintAddress = mintInfo?.address
  const chainMintAddresses = useMemo(() => {
    if (!hops.length || !account.isAddress(srcMintAddress)) return []
    let list = [srcMintAddress]
    for (const hop of hops) {
      const { dstMintAddress } = hop
      if (account.isAddress(dstMintAddress)) list.push(dstMintAddress)
    }
    return list
  }, [srcMintAddress, hops])

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
    </Space>
  )
}
export default RouteAvatar
