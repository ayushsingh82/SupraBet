import React from 'react'

const PriceChart = ({ data, symbol }) => {
  // Add check for empty or invalid data
  if (!data || data.length === 0) {
    return (
      <div className="w-full text-center text-sm text-gray-400">
        Loading price data...
      </div>
    )
  }

  // Calculate chart dimensions
  const width = 120
  const height = 40
  const padding = 5

  try {
    // Find min and max values for scaling
    const prices = data.map(point => point?.price || 0)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice

    // Calculate points for the sparkline
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * (width - 2 * padding) + padding
      const y = height - padding - ((point.price - minPrice) / priceRange) * (height - 2 * padding)
      return `${x},${y}`
    }).join(' ')

    // Calculate price change percentage
    const priceChange = ((data[data.length - 1].price - data[0].price) / data[0].price) * 100
    const isPositive = priceChange >= 0

    return (
      <div className="w-full">
        {/* Price Change */}
        <div className={`text-sm mb-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
        </div>

        {/* Chart */}
        <svg width={width} height={height} className="w-full">
          <defs>
            <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isPositive ? 'rgb(34,197,94)' : 'rgb(239,68,68)'} stopOpacity="0.2" />
              <stop offset="100%" stopColor={isPositive ? 'rgb(34,197,94)' : 'rgb(239,68,68)'} stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Area under the line */}
          <path
            d={`M ${padding},${height - padding} ${points} ${width - padding},${height - padding} Z`}
            fill={`url(#gradient-${symbol})`}
          />
          
          {/* Line */}
          <path
            d={`M ${points}`}
            fill="none"
            stroke={isPositive ? 'rgb(34,197,94)' : 'rgb(239,68,68)'}
            strokeWidth="1.5"
          />
        </svg>
      </div>
    )
  } catch (error) {
    console.error('Error rendering chart:', error)
    return (
      <div className="w-full text-center text-sm text-gray-400">
        Error loading chart
      </div>
    )
  }
}

export default PriceChart 