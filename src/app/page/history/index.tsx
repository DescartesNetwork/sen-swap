import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Card, Col, Row, Typography, Table, Button } from 'antd'
import { HISTORY_COLUMN } from './column'
import IonIcon from 'shared/antd/ionicon'

import { fetchHistorySwap } from 'app/model/history.controller'
import { AppDispatch, AppState } from 'app/model'

import './index.less'

const ROW_PER_PAGE = 5
const LIMIT_IN_STORE = 15
const TABLE_HEIGHT = 462

const History = () => {
  const [amountRow, setAmountRow] = useState(ROW_PER_PAGE)
  const [loading, setLoading] = useState(false)

  const { historySwap } = useSelector((state: AppState) => state.history)
  const dispatch = useDispatch<AppDispatch>()

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    await dispatch(fetchHistorySwap({})).unwrap()
    setLoading(false)
  }, [dispatch])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const onHandleViewMore = () => {
    const currentTransactionDataLength = historySwap.slice(0, amountRow).length

    if (historySwap.length - currentTransactionDataLength <= LIMIT_IN_STORE) {
      const lastSignature = historySwap.at(-1)?.transactionId
      dispatch(
        fetchHistorySwap({
          lastSignature,
          isLoadMore: true,
        }),
      )
    }
    setAmountRow(amountRow + ROW_PER_PAGE)
  }

  const onHandleRefeshTable = () => {
    fetchHistory()
    setAmountRow(ROW_PER_PAGE)
  }

  const style = useMemo(() => {
    return amountRow > 5 ? { height: 'auto' } : { height: TABLE_HEIGHT }
  }, [amountRow])

  return (
    <Card bordered={false} style={{ ...style }}>
      <Row gutter={[16, 24]}>
        <Col flex="auto">
          <Typography.Title level={5}>Swap history</Typography.Title>
        </Col>
        <Col>
          <Button onClick={onHandleRefeshTable}>Refresh</Button>
        </Col>
        <Col span={24}>
          <Row justify="center" gutter={[16, 9]}>
            <Col span={24} style={{ minHeight: 310 }}>
              <Table
                columns={HISTORY_COLUMN}
                dataSource={historySwap.slice(0, amountRow)}
                loading={loading}
                pagination={false}
                rowClassName={(record, index) =>
                  index % 2 ? 'odd-row' : 'even-row'
                }
                scroll={historySwap.length ? { x: 800 } : {}}
              />
            </Col>
            <Col>
              <Button
                onClick={onHandleViewMore}
                type="text"
                icon={<IonIcon name="chevron-down-outline" />}
                disabled={amountRow >= historySwap.length}
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
