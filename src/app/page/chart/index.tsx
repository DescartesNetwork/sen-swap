import { useSelector } from 'react-redux'

import { Card, Col, Radio, Row, Space, Typography } from 'antd'
import { AppState } from 'app/model'
import SenChart from './chart'
import GroupAvatar from './GroupAvatar'
import { useMemo } from 'react'

const CHART_CONFIGS = {
  color: '#5D6CCF',
  radius: 0,
  hitRadius: 14,
  tooltip: 'TVL',
  transparent: 'transparent',
}
const DEFAULT_TOKEN = 'UNKN'

const SwapChart = () => {
  const swapChartConfigs = {
    borderColor: CHART_CONFIGS.transparent,
    borderRadius: CHART_CONFIGS.radius,
    pointRadius: CHART_CONFIGS.radius,
    tooltip: CHART_CONFIGS.tooltip,
    pointHitRadius: CHART_CONFIGS.hitRadius,
    pointHoverRadius: CHART_CONFIGS.radius,
    backgroundColor: CHART_CONFIGS.color,
  }
  const bidData = useSelector((state: AppState) => state.bid)
  const askData = useSelector((state: AppState) => state.ask)

  const icons = useMemo(() => {
    return [bidData.mintInfo?.logoURI, askData.mintInfo?.logoURI]
  }, [askData.mintInfo?.logoURI, bidData.mintInfo?.logoURI])
  const symbols = useMemo(() => {
    return [
      bidData.mintInfo?.symbol || DEFAULT_TOKEN,
      askData.mintInfo?.symbol || DEFAULT_TOKEN,
    ]
  }, [askData.mintInfo?.symbol, bidData.mintInfo?.symbol])

  return (
    <Card bordered={false} className="card-swap" bodyStyle={{ paddingTop: 28 }}>
      <Row gutter={[24, 24]}>
        <Col flex="auto">
          <Space direction="vertical" size={20}>
            <Space size={4} align="baseline">
              <GroupAvatar icons={icons} size={24} />
              <Typography.Text>{symbols.join('/')}</Typography.Text>
            </Space>
            <Typography.Title level={2}>0.24 </Typography.Title>
          </Space>
        </Col>
        <Col>
          <Radio.Group defaultValue="week">
            <Radio.Button value="day">Day</Radio.Button>
            <Radio.Button value="week">Week</Radio.Button>
            <Radio.Button value="month">Month</Radio.Button>
            <Radio.Button value="year">Year</Radio.Button>
          </Radio.Group>
        </Col>
        <Col span={24}>
          <SenChart
            chartData={[12, 123, 141, 2, 512, 12, 113]}
            labels={['01/12', '02/12', '03/12', '04/12', '05/12']}
            configs={swapChartConfigs}
          />
        </Col>
      </Row>
    </Card>
  )
}

export default SwapChart
