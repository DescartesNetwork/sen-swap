import { Space, Typography } from 'antd'
import { MintAvatar } from 'app/shared/components/mint'
import StatusTag from './statusTag'

export const HISTORY_COLUMN = [
  {
    title: 'TIME',
    dataIndex: 'time',
  },
  {
    title: 'TRANSACTION',
    className: 'transaction',
    dataIndex: 'transaction',
  },
  {
    title: 'PAID',
    dataIndex: 'paid',
    render: (text: string) => (
      <Space>
        <MintAvatar mintAddress={text} />
        <Typography.Text>SOL</Typography.Text> -
        <MintAvatar mintAddress={text} />
        <Typography.Text>ETH</Typography.Text>
      </Space>
    ),
  },
  {
    title: 'AMOUNT',
    dataIndex: 'amount',
  },
  {
    title: 'STATUS',
    dataIndex: 'status',
    render: (text: string) => <StatusTag tag="success" />,
  },
]
