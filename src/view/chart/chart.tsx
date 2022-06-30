import { useCallback, useState, useRef, useEffect } from 'react'
import Chart from 'chart.js'
import isEqual from 'react-fast-compare'

import { util } from '@sentre/senhub'

const DEFAULT_BACKGROUND_COLOR = '#dadada'

export type SenChartProps = {
  labels?: (number | string)[]
  chartData?: (number | string)[]
  configs?: { backgroundColor?: string } & object
  type?: string
  disableAxe?: boolean
  chartHeight?: string
  chartId?: string
}

const SenChart = ({
  chartData = [],
  labels = [],
  type = 'line',
  configs,
  disableAxe = false,
  chartId = 'sen_chart',
}: SenChartProps) => {
  const { backgroundColor } = configs || {}
  const [isRebuildChart, setRebuildChart] = useState<boolean>(false)

  const formatData = useCallback(
    (
      data: Array<number | number[] | undefined | null | any>,
      label: Array<string | number>,
      background?: string | CanvasGradient | undefined,
    ): Chart.ChartData => ({
      labels: label,
      datasets: [{ ...configs, data, backgroundColor: background }],
    }),
    [configs],
  )
  // use a ref to store the chart instance since it it mutable
  const chartRef = useRef<Chart | null>(null)

  // callback creates the chart on the canvas element
  const canvasCallback = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx && !isRebuildChart) {
      // create new chart
      chartRef.current = new Chart(ctx, {
        type: type,
        data: {
          labels: [],
          datasets: [
            {
              data: [],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                gridLines: {
                  drawBorder: false,
                  display: false,
                },
                ticks: {
                  display: !disableAxe,
                },
              },
            ],
            yAxes: [
              {
                gridLines: {
                  drawBorder: false,
                  display: false,
                },
                ticks: {
                  display: !disableAxe,
                  beginAtZero: false,
                  maxTicksLimit: 8,
                  callback: function (value, index, values) {
                    return util.numeric(value).format('0,0.[0]a')
                  },
                },
              },
            ],
          },
          plugins: {
            legend: false,
          },
          hover: {
            onHover: (event, elements) => {
              const target = document.getElementById(chartId)
              if (!target) return
              target.style.cursor = elements[0] ? 'pointer' : 'default'
            },
          },
        },
      })
      setRebuildChart(true)
    }
  }

  const getBackground = useCallback(() => {
    if (!chartRef || !backgroundColor) return DEFAULT_BACKGROUND_COLOR
    const ctx = chartRef?.current?.canvas?.getContext('2d')
    const gradient = ctx?.createLinearGradient(0, 0, 0, 180)
    gradient?.addColorStop(0, backgroundColor)
    gradient?.addColorStop(1, `${backgroundColor}00`)
    const background = type === 'line' ? gradient : backgroundColor
    return background
  }, [backgroundColor, type])

  useEffect(() => {
    const chartInstance = chartRef.current
    const dataInstace = chartInstance?.data.datasets?.find(({ data }) => data)
    const compareData = isEqual(dataInstace?.data, chartData)
    if (chartInstance && !compareData) {
      chartInstance.data = formatData(chartData, labels, getBackground())
      chartInstance?.update()
    }
  }, [chartData, formatData, getBackground, labels])

  return <canvas id={chartId} height="180px" ref={canvasCallback}></canvas>
}

export default SenChart
