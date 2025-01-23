import React, { useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'

const PriceChart = ({ data, symbol, height = 120 }) => {
  const chartContainerRef = useRef()
  const chartRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      height: height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false }
      },
      timeScale: {
        visible: false,
      },
      rightPriceScale: {
        visible: false,
      },
      crosshair: {
        vertLine: { visible: false },
        horzLine: { visible: false }
      },
      handleScroll: false,
      handleScale: false,
    })

    // Create area series
    const areaSeries = chart.addAreaSeries({
      lineColor: '#FF3366',
      topColor: 'rgba(255, 51, 102, 0.2)',
      bottomColor: 'rgba(255, 51, 102, 0)',
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    })

    // Normalize data to show only direction
    const prices = data.map(item => parseFloat(item.price))
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const range = maxPrice - minPrice

    const normalizedData = data.map(item => ({
      time: item.timestamp / 1000,
      value: ((parseFloat(item.price) - minPrice) / range) * 100
    }))

    areaSeries.setData(normalizedData)

    // Fit content
    chart.timeScale().fitContent()

    chartRef.current = chart

    return () => {
      chart.remove()
    }
  }, [data, height])

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full rounded-xl overflow-hidden bg-background/20 backdrop-blur-sm"
    />
  )
}

export default PriceChart 