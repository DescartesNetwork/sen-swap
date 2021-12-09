import { Space, Typography } from 'antd'
import { State as BidState } from 'app/model/bid.controller'
import { State as AskState } from 'app/model/bid.controller'

const InversePrice = ({
  bidData,
  askData,
}: {
  bidData?: BidState
  askData?: AskState
}) => {
  return (
    <Space>
      <Typography.Text>{bidData?.amount}</Typography.Text>
      <Typography.Text>{bidData?.mintInfo?.symbol}</Typography.Text>
      <Typography.Text>=</Typography.Text>
      <Typography.Text>{askData?.amount}</Typography.Text>
      <Typography.Text>{askData?.mintInfo?.symbol}</Typography.Text>
    </Space>
  )
}

export default InversePrice
