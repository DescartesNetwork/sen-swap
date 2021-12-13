import { Button, Space, Typography } from 'antd'
import { MintAvatar, MintSymbol } from 'app/shared/components/mint'
import IonIcon from 'shared/antd/ionicon'
import { explorer, numeric, shortenAddress } from 'shared/util'
import StatusTag from './statusTag'

const FORMAT_AMOUNT = '0,00.[0000]a'

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
    title: 'AMOUNT',
    dataIndex: 'amount',
    width: 400,
    render: (text: string, record: any) => (
      <Space size={8}>
        {numeric(record.amountFrom).format(FORMAT_AMOUNT)}
        <MintSymbol mintAddress={record.from} />
        <MintAvatar mintAddress={record.from} />
        <IonIcon name="arrow-forward-outline" />
        {numeric(record.amountTo).format(FORMAT_AMOUNT)}
        <MintSymbol mintAddress={record.to} />
        <MintAvatar mintAddress={record.to} />
      </Space>
    ),
  },
  {
    title: 'STATUS',
    dataIndex: 'status',
    width: 100,
    render: (text: string) => <StatusTag tag="success" />,
  },
]
