import { useState } from 'react'
import moment from 'moment'

import { Card, Col, Row, Typography, Table, Button } from 'antd'
import { HISTORY_COLUMN } from './column'
import IonIcon from 'shared/antd/ionicon'

import './index.less'

const ROW_PER_PAGE = 5

const History = () => {
  const [amountRow, setAmountRow] = useState(ROW_PER_PAGE)

  const data = {
    key: 0,
    time: moment().format('DD MMM, YYYY hh:mm'),
    transaction: 'Swap Solana',
    paid: 'Solana - Ethereum',
    amount: '',
    status: 'success',
  }
  const sources = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e) => {
    data.key = e
    data.amount = `${e} SOL`
    return { ...data }
  })

  const onHandleViewMore = () => {
    setAmountRow(amountRow + ROW_PER_PAGE)
  }

  return (
    <Card bordered={false} style={{ height: 464 }}>
      <Row gutter={[16, 24]}>
        <Col>
          <Typography.Title level={5}>Swap history</Typography.Title>
        </Col>
        <Col span={24}>
          <Row justify="center" gutter={[16, 9]}>
            <Col span={24} style={{ height: 336 }}>
              <Table
                columns={HISTORY_COLUMN}
                dataSource={sources.slice(0, amountRow)}
                pagination={false}
                rowClassName={(record, index) =>
                  index % 2 ? 'odd-row' : 'even-row'
                }
                scroll={{ x: 800, y: 280 }}
              />
            </Col>
            <Col>
              <Button
                onClick={onHandleViewMore}
                type="text"
                icon={<IonIcon name="chevron-down-outline" />}
                disabled={amountRow >= sources.length}
              >
                View more
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default History
