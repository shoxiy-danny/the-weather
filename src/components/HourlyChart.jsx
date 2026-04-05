import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
)

export default function HourlyChart({ data }) {
  const { labels, temps, currentIndex } = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return { labels: [], temps: [], currentIndex: 2 }
    }

    // Since we prepend 2 past hours, current time is at index 2
    const idx = 2

    const labels = data.map((item) => {
      const date = new Date(item.fxTime)
      return `${date.getHours()}`
    })

    const temps = data.map(item => Math.round(item.temp))

    return {
      labels,
      temps,
      currentIndex: idx,
    }
  }, [data])

  // Plugin to draw current time vertical line
  const currentTimeLinePlugin = {
    id: 'currentTimeLine',
    afterDraw: (chart) => {
      const ctx = chart.ctx
      const xAxis = chart.scales.x
      const yAxis = chart.scales.y
      const idx = chart.options.plugins.currentTimeLine.currentIndex
      const x = xAxis.getPixelForValue(idx)

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(x, yAxis.top)
      ctx.lineTo(x, yAxis.bottom)
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.stroke()

      // Draw "现在" label
      ctx.fillStyle = '#ffd700'
      ctx.font = 'bold 10px Inter'
      ctx.textAlign = 'center'
      ctx.fillText('现在', x, yAxis.top - 2)
      ctx.restore()
    },
  }

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1a1a2e',
        titleFont: { weight: 'normal' },
        bodyColor: '#1a1a2e',
        bodyFont: { weight: 'bold' },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (items) => items[0]?.label ? `${items[0].label}点` : '',
          label: (item) => `${item.raw}°`,
          labelTextColor: (item) => {
            const temp = item.raw
            if (temp < 10) return '#87ceeb'
            if (temp > 20) return '#ff6b6b'
            return '#1a1a2e'
          },
        },
      },
      currentTimeLine: { currentIndex },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: (context) => {
            if (context.index === currentIndex) return '#ffd700'
            return 'rgba(255, 255, 255, 0.5)'
          },
          font: { size: 11 },
          maxRotation: 0,
        },
        border: { display: false },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          font: { size: 11 },
          callback: (value) => `${value}°`,
        },
        border: { display: false },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animation: {
      duration: 600,
      easing: 'easeOutQuart',
    },
  }), [currentIndex])

  return (
    <div className="card hourly-chart">
      <div className="card-title">24小时</div>
      <div className="chart-container">
        <Line
          data={{ labels, datasets: [{ data: temps, fill: true, borderColor: '#ffd700', backgroundColor: 'rgba(255, 215, 0, 0.2)', tension: 0.4, pointRadius: 0, pointHoverRadius: 6, pointHoverBackgroundColor: '#ffd700', pointHoverBorderColor: '#ffffff', pointHoverBorderWidth: 2 }] }}
          options={options}
          plugins={[currentTimeLinePlugin]}
        />
      </div>
    </div>
  )
}
