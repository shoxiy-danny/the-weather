import { WEATHER_CODES } from '../utils/constants'

const icons = {
  '100': (size = 48) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="25" fill="#ffd700" />
      <g stroke="#ffd700" strokeWidth="4" strokeLinecap="round">
        <line x1="50" y1="10" x2="50" y2="20" />
        <line x1="50" y1="80" x2="50" y2="90" />
        <line x1="10" y1="50" x2="20" y2="50" />
        <line x1="80" y1="50" x2="90" y2="50" />
        <line x1="22" y1="22" x2="29" y2="29" />
        <line x1="71" y1="71" x2="78" y2="78" />
        <line x1="22" y1="78" x2="29" y2="71" />
        <line x1="71" y1="29" x2="78" y2="22" />
      </g>
    </svg>
  ),
  '101': (size = 48) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="35" cy="40" r="18" fill="#ffd700" />
      <g stroke="#ffd700" strokeWidth="3" strokeLinecap="round">
        <line x1="35" y1="10" x2="35" y2="18" />
        <line x1="10" y1="40" x2="18" y2="40" />
        <line x1="17" y1="20" x2="22" y2="25" />
      </g>
      <ellipse cx="55" cy="65" rx="25" ry="15" fill="rgba(255,255,255,0.8)" />
      <ellipse cx="70" cy="60" rx="20" ry="12" fill="rgba(255,255,255,0.8)" />
      <ellipse cx="45" cy="70" rx="18" ry="10" fill="rgba(255,255,255,0.8)" />
    </svg>
  ),
  '104': (size = 48) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <ellipse cx="50" cy="55" rx="35" ry="20" fill="rgba(255,255,255,0.6)" />
      <ellipse cx="30" cy="50" rx="20" ry="15" fill="rgba(255,255,255,0.7)" />
      <ellipse cx="70" cy="50" rx="20" ry="15" fill="rgba(255,255,255,0.7)" />
      <ellipse cx="50" cy="45" rx="25" ry="18" fill="rgba(255,255,255,0.65)" />
    </svg>
  ),
  default: (size = 48) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="30" fill="rgba(135,206,235,0.8)" />
      <ellipse cx="50" cy="60" rx="25" ry="10" fill="rgba(135,206,235,0.6)" />
    </svg>
  ),
}

export default function WeatherIcon({ code, size = 48 }) {
  const Icon = icons[code] || icons.default
  return <span style={{ display: 'inline-flex', animation: 'float 3s ease-in-out infinite' }}>{Icon(size)}</span>
}
