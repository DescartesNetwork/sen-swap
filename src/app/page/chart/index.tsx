import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'

import { Card, Col, Radio, Row, Space, Typography } from 'antd'
import { AppState } from 'app/model'
import SenChart from './chart'
import GroupAvatar from './GroupAvatar'
import ChartEmpty from './chartEmpty'
import { ChartParamsCGK, fetchMarketChart } from 'app/helper/cgk'

type ChartProperties = {
  range: number
  size: number
}

const CHART_CONFIGS = {
  color: '#5D6CCF',
  radius: 0,
  hitRadius: 14,
  tooltip: 'TVL',
  transparent: 'transparent',
}
const CHART_RANGE: Record<string, ChartParamsCGK & ChartProperties> = {
  week: { day: 'max', interval: 'daily', range: 1, size: 7 },
  day: { day: '1', interval: 'hourly', range: 4, size: 7 },
  month: { day: 'max', interval: 'daily', range: 6, size: 6 },
  year: { day: 'max', interval: 'daily', range: 60, size: 6 },
}
const DEFAULT_TOKEN = 'UNKN'

const SwapChart = () => {
  const [chartRange, setChartRange] = useState('year')
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
      fetchMarketChart(askTicket, CHART_RANGE[chartRange]),
      fetchMarketChart(bidTicket, CHART_RANGE[chartRange]),
    ])
    const range = CHART_RANGE[chartRange].range
    let size = CHART_RANGE[chartRange].size

    const chartData: { label: string; val: number }[] = []
    const thisDay = moment(bidChart[bidChart.length - 1].time).format('DD')

    let count = range
    let isYesterday = false

    for (let idx = bidChart.length - 1; idx >= 0; idx--) {
      count++
      const bidDay = bidChart[idx]
      const askDay = askChart[askChart.length - 1 - (bidChart.length - 1 - idx)]
      if (!bidDay || !askDay) break
      if (chartData.length >= size) break
      const val = +Number(bidDay.val / askDay.val).toFixed(8)
      const dateCount = bidChart.length - 1 - idx
      const getDate = moment(bidDay.time).format('DD')
      const getDateMonth = moment(bidDay.time).format('DD/MM')

      if (
        chartRange === 'year' &&
        dateCount > -1 &&
        getDate === thisDay &&
        count >= range
      ) {
        const label = moment(bidDay.time).format('DD/MM')
        chartData.unshift({ label, val })
        count = 0
      }

      if (chartRange !== 'year' && dateCount > -1 && dateCount % range === 0) {
        let label = ''
        if (chartRange === 'day' && getDate !== thisDay && !isYesterday) {
          label = moment(bidDay.time).format('DD.MMM')
          isYesterday = true
          chartData.unshift({ label, val })
          continue
        }
        if (chartRange === 'day') label = moment(bidDay.time).format('HH:00')

        if (chartRange === 'week' && getDateMonth === chartData[0]?.label) {
          label = getDateMonth
          chartData[0].label = ''
        }

        if (chartRange === 'month' || chartRange === 'week')
          label = getDateMonth

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
                  defaultValue="year"
                  onChange={(e) => setChartRange(e.target.value)}
                  className="chart-radio-btn"
                >
                  <Radio.Button value="day">1D</Radio.Button>
                  <Radio.Button value="week">1W</Radio.Button>
                  <Radio.Button value="month">1M</Radio.Button>
                  <Radio.Button value="year">1Y</Radio.Button>
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
