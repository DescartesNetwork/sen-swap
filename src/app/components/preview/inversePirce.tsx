import { Space, Typography } from 'antd'
import { State as BidState } from 'app/model/bid.controller'
import { State as AskState } from 'app/model/bid.controller'
import { numeric } from 'shared/util'

const InversePrice = ({
  bidData,
  askData,
}: {
  bidData?: BidState
  askData?: AskState
}) => {
  const price = numeric(
    Number(askData?.amount) / Number(bidData?.amount),
  ).format('0,0.[000000]')
  const symbols = `${askData?.mintInfo?.symbol}/${bidData?.mintInfo?.symbol}`
  return (
    <Space>
      <Typography.Text>{price}</Typography.Text>
      <Typography.Text>{symbols}</Typography.Text>
    </Space>
  )
}

export default InversePrice
