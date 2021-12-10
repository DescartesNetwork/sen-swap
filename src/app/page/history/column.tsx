import { Button, Space, Typography } from 'antd'
import { MintAvatar, MintSymbol } from 'app/shared/components/mint'
import IonIcon from 'shared/antd/ionicon'
import { explorer, shortenAddress } from 'shared/util'
import StatusTag from './statusTag'

export const HISTORY_COLUMN = [
  {
    title: 'TIME',
    dataIndex: 'time',
  },
  {
    title: 'TRANSACTION',
    dataIndex: 'transactionId',
    render: (text: string) => (
      <Space align="baseline">
        <Typography.Text
          onClick={() => window.open(explorer(text), '_blank')}
          style={{ fontWeight: 700, cursor: 'pointer' }}
        >
          {shortenAddress(text, 3, '...')}
        </Typography.Text>
        <Button
          type="text"
          size="small"
          onClick={() => window.open(explorer(text), '_blank')}
          icon={<IonIcon name="open-outline" />}
        />
      </Space>
    ),
  },
  {
    title: 'PAID',
    dataIndex: 'paid',
    render: (text: string, record: any) => (
      <Space>
        <MintAvatar mintAddress={record.from} />
        <MintSymbol mintAddress={record.from} />
        <span>-</span>
        <MintAvatar mintAddress={record.to} />
        <MintSymbol mintAddress={record.to} />
      </Space>
    ),
  },
  {
    title: 'AMOUNT',
    dataIndex: 'amount',
    align: 'center' as 'center',
    render: (text: string, record: any) => (
      <Typography.Text>
        <Space size={4}>
          {text}
          <MintSymbol mintAddress={record.from} />
        </Space>
      </Typography.Text>
    ),
  },
  {
    title: 'STATUS',
    dataIndex: 'status',
    width: 100,
    render: (text: string) => <StatusTag tag="success" />,
  },
]
