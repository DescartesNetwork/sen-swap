import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'

import { Card, Col, Radio, Row, Space, Typography } from 'antd'
import { AppState } from 'app/model'
import SenChart from './chart'
import GroupAvatar from './GroupAvatar'
import ChartEmpty from './chartEmpty'
import { fetchMarketChart } from 'app/helper/cgk'

const CHART_CONFIGS = {
  color: '#5D6CCF',
  radius: 0,
  hitRadius: 14,
  tooltip: 'TVL',
  transparent: 'transparent',
}
const CHART_RANGE: Record<string, number> = {
  week: 7,
  day: 1,
  month: 30,
  year: 365,
}
const DEFAULT_TOKEN = 'UNKN'

const SwapChart = () => {
  const [chartRange, setChartRange] = useState('week')
  const [chartData, setChartData] = useState<{ label: string; val: number }[]>(
    [],
  )

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

  const fetchChartData = useCallback(async () => {
    const askTicket = askData.mintInfo?.extensions?.coingeckoId
    const bidTicket = bidData.mintInfo?.extensions?.coingeckoId
    if (!askTicket || !bidTicket) return setChartData([])

    const [askChart, bidChart] = await Promise.all([
      fetchMarketChart(askTicket),
      fetchMarketChart(bidTicket),
    ])
    const range = CHART_RANGE[chartRange] || 7 //day
    const size = 10

    const chartData: { label: string; val: number }[] = []
    for (let idx = bidChart.length - 1; idx >= 0; idx--) {
      const bidDay = bidChart[idx]
      const askDay = askChart[askChart.length - 1 - (bidChart.length - 1 - idx)]
      if (!bidDay || !askDay) break
      if (chartData.length >= size) break
      const val = +Number(bidDay.val / askDay.val).toFixed(8)
      const dateCount = bidChart.length - 1 - idx
      if (dateCount > -1 && dateCount % range === 0) {
        const label = moment(bidDay.time).format('DD/MM')
        chartData.unshift({ label, val })
      }
    }
    setChartData(chartData)
  }, [
    askData.mintInfo?.extensions?.coingeckoId,
    bidData.mintInfo?.extensions?.coingeckoId,
    chartRange,
  ])
  useEffect(() => {
    fetchChartData()
  }, [fetchChartData])

  return (
    <Card bordered={false} className="card-swap" bodyStyle={{ paddingTop: 28 }}>
      <Row gutter={[24, 24]}>
        <Col flex="auto">
          <Row gutter={[20, 20]}>
            <Col flex="auto">
              <Space size={4} align="center">
                <GroupAvatar icons={icons} size={24} />
                <Typography.Text>{symbols.join('/')}</Typography.Text>
              </Space>
            </Col>
            {chartData && !!chartData.length && (
              <Col>
                <Radio.Group
                  defaultValue="week"
                  onChange={(e) => setChartRange(e.target.value)}
                  className="chart-radio-btn"
                >
                  <Radio.Button value="day">Day</Radio.Button>
                  <Radio.Button value="week">Week</Radio.Button>
                  <Radio.Button value="month">Month</Radio.Button>
                  {/* <Radio.Button value="year">Year</Radio.Button> */}
                </Radio.Group>
              </Col>
            )}
            <Col span={24}>
              <Typography.Title level={2}>
                {chartData.at(-1)?.val}
              </Typography.Title>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          {chartData && !!chartData.length ? (
            <SenChart
              chartData={chartData?.map((data) => data.val)}
              labels={chartData?.map((data) => data.label)}
              configs={swapChartConfigs}
            />
          ) : (
            <ChartEmpty />
          )}
        </Col>
      </Row>
    </Card>
  )
}

export default SwapChart
