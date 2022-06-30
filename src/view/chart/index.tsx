import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { useMint } from '@sentre/senhub'

import { Button, Card, Col, Radio, Row, Typography, Space, Popover } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import Cross from './cross'
import SenChart from './chart'
import ChartEmpty from './chartEmpty'
import PoweredByCoinGecko from 'components/poweredByCoingecko'

import { AppState } from 'model'
import { ChartParamsCGK, fetchMarketChart } from 'helper/cgk'
import { util } from '@sentre/senhub'

type ChartData = { label: string; val: number }
enum Interval {
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year',
}
const CHART_DATA_CONFIG: Record<
  Interval,
  {
    amount: number
    unit: moment.unitOfTime.DurationConstructor
    format: string
  }
> = {
  day: { amount: 4, unit: 'hours', format: 'HH:00' },
  week: { amount: 1, unit: 'days', format: 'MMM DD' },
  month: { amount: 5, unit: 'days', format: 'MMM DD' },
  year: { amount: 2, unit: 'months', format: 'MMM DD' },
}
const MARKET_CONFIG: Record<Interval, ChartParamsCGK> = {
  day: { days: 1, interval: 'hourly' },
  week: { days: 7, interval: 'daily' },
  month: { days: 31, interval: 'daily' },
  year: { days: 365, interval: 'daily' },
}

const CHART_CONFIGS = {
  color: '#3E8C6A',
  radius: 0,
  hitRadius: 14,
  tooltip: 'TVL',
  transparent: 'transparent',
}

const SwapChart = () => {
  const [interval, setInterval] = useState(Interval.week)
  const [chartData, setChartData] = useState<{ label: string; val: number }[]>(
    [],
  )
  const bidData = useSelector((state: AppState) => state.bid)
  const askData = useSelector((state: AppState) => state.ask)
  const { tokenProvider } = useMint()

  const swapChartConfigs = {
    borderColor: CHART_CONFIGS.transparent,
    borderRadius: CHART_CONFIGS.radius,
    pointRadius: CHART_CONFIGS.radius,
    tooltip: CHART_CONFIGS.tooltip,
    pointHitRadius: CHART_CONFIGS.hitRadius,
    pointHoverRadius: CHART_CONFIGS.radius,
    backgroundColor: CHART_CONFIGS.color,
  }

  const parseChartDay = useCallback(
    (marketData: { time: number; val: number }[]) => {
      const chartData: ChartData[] = []
      const { format, amount, unit } = CHART_DATA_CONFIG[interval]
      let displayTime = moment()
      // parser data
      for (const data of marketData.reverse()) {
        const chartTime = moment(data.time).format(format)
        if (chartTime === displayTime.format(format)) {
          const now = moment().format(format)
          let label = chartTime
          if (chartTime === now) label = moment().format('HH:mm')
          if (displayTime)
            chartData.unshift({
              label: label,
              val: data.val,
            })
          displayTime = displayTime.subtract(amount, unit)
        } else if (chartTime === '00:00') {
          chartData.unshift({
            label: displayTime.format('MMM DD'),
            val: data.val,
          })
        }
      }
      setChartData(chartData)
    },
    [interval],
  )

  const parseChartDaily = useCallback(
    (marketData: { time: number; val: number }[]) => {
      const chartData: ChartData[] = []
      const { format, amount, unit } = CHART_DATA_CONFIG[interval]
      let displayTime = moment()
      // parser data
      for (const data of marketData.reverse()) {
        const chartTime = moment(data.time).format(format)
        if (chartTime === displayTime.format(format)) {
          displayTime = displayTime.subtract(amount, unit)
          chartData.unshift({
            label: chartTime,
            val: data.val,
          })
          continue
        }
      }
      setChartData(chartData)
    },
    [interval],
  )

  const fetchChartData = useCallback(async () => {
    // fetch data market from coingecko
    const bidTokenInfo = await tokenProvider.findByAddress(
      bidData.mintInfo?.address || '',
    )
    const askTokenInfo = await tokenProvider.findByAddress(
      askData.mintInfo?.address || '',
    )
    const bidTicket = bidTokenInfo?.extensions?.coingeckoId
    const askTicket = askTokenInfo?.extensions?.coingeckoId
    // return when bid & ask address is same
    const compareAddress = bidData.accountAddress === askData.accountAddress
    if (!askTicket || !bidTicket || compareAddress) return setChartData([])

    const marketConfig = MARKET_CONFIG[interval]
    const [bidChartData, askChartData] = await Promise.all([
      fetchMarketChart(bidTicket, marketConfig),
      fetchMarketChart(askTicket, marketConfig),
    ])
    // parser market data
    const marketData: { time: number; val: number }[] = []
    for (let idx = bidChartData.length - 1; idx >= 0; idx--) {
      const bidChart = bidChartData[idx]
      const askChart =
        askChartData[askChartData.length - bidChartData.length + idx]
      if (!bidChart || !askChart) continue
      marketData.unshift({
        time: bidChart.time,
        val: askChart.val / bidChart.val,
      })
    }
    if (interval === Interval.day) return parseChartDay(marketData)
    return parseChartDaily(marketData)
  }, [
    askData.accountAddress,
    askData.mintInfo?.address,
    bidData.accountAddress,
    bidData.mintInfo?.address,
    interval,
    parseChartDaily,
    parseChartDay,
    tokenProvider,
  ])

  useEffect(() => {
    fetchChartData()
  }, [fetchChartData])

  const price = chartData[chartData.length - 1]?.val || 0
  const priceUI = util
    .numeric(price)
    .format(price > 1 ? '0,0.[00]' : '0,0.[00000000]')

  return (
    <Card bordered={false} className="card-swap" bodyStyle={{ paddingTop: 28 }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row gutter={[20, 20]}>
            <Col flex="auto">
              <Space>
                <Cross />
                <Popover
                  content={
                    <PoweredByCoinGecko title="Reference Market Price. Powered by" />
                  }
                >
                  <Button
                    type="text"
                    icon={<IonIcon name="information-circle-outline" />}
                  />
                </Popover>
              </Space>
            </Col>
            {chartData && !!chartData.length && (
              <Col>
                <Radio.Group
                  defaultValue={Interval.week}
                  onChange={(e) => setInterval(e.target.value)}
                  className="chart-radio-btn"
                >
                  <Radio.Button value={Interval.day}>1D</Radio.Button>
                  <Radio.Button value={Interval.week}>1W</Radio.Button>
                  <Radio.Button value={Interval.month}>1M</Radio.Button>
                  <Radio.Button value={Interval.year}>1Y</Radio.Button>
                </Radio.Group>
              </Col>
            )}
            <Col span={24}>
              <Typography.Title level={2}>
                {price ? priceUI : ''}
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
