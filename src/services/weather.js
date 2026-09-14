const key = import.meta.env.VITE_OPENWEATHER_API_KEY
const cacheKey = (lat, lon, units) => `weatherly:${lat.toFixed(2)}:${lon.toFixed(2)}:${units}`

export const conditionMeta = (id = 800, icon = '') => {
  const night = icon.endsWith('n')
  if (id >= 200 && id < 300) return { category: 'thunderstorm', label: 'Thunderstorms', symbol: '⛈️' }
  if (id >= 300 && id < 400) return { category: 'rain', label: 'Drizzle', symbol: '🌦️' }
  if (id >= 500 && id < 600) return { category: 'rain', label: 'Rain', symbol: '🌧️' }
  if (id >= 600 && id < 700) return { category: 'snow', label: 'Snow', symbol: '❄️' }
  if (id >= 700 && id < 800) return { category: 'atmosphere', label: 'Hazy', symbol: '🌫️' }
  if (id === 800) return { category: night ? 'night' : 'clear', label: night ? 'Clear night' : 'Clear sky', symbol: night ? '🌙' : '☀️' }
  return { category: 'clouds', label: id > 802 ? 'Overcast' : 'Partly cloudy', symbol: '⛅' }
}

const demo = (place, units) => {
  const now = Date.now() / 1000
  const temp = units === 'imperial' ? 82 : 28
  return { location: { name: place.name, state: place.state, country: place.country, lat: place.lat, lon: place.lon, timezone: 28800 }, current: { temp, feels_like: temp + 3, humidity: 74, pressure: 1012, visibility: 10000, wind_speed: units === 'imperial' ? 9 : 14, wind_deg: 48, wind_gust: units === 'imperial' ? 13 : 20, uvi: 6, clouds: 42, dew_point: temp - 6, sunrise: now - 18000, sunset: now + 22000, weather: [{ id: 803, description: 'scattered clouds', icon: '02d' }] }, hourly: Array.from({ length: 12 }, (_, i) => ({ dt: now + i * 3600, temp: temp + Math.round(Math.sin(i / 2) * 2), pop: i > 5 ? 0.35 : 0.12, rain: { '1h': i > 5 ? 0.2 : 0 } , weather: [{ id: i > 5 ? 500 : 803, icon: i > 5 ? '10d' : '02d' }] })), daily: Array.from({ length: 8 }, (_, i) => ({ dt: now + i * 86400, temp: { max: temp + 2 - (i % 3), min: temp - 4 - (i % 2) }, pop: i % 3 === 0 ? 0.42 : 0.14, weather: [{ id: i % 3 === 0 ? 500 : 800, description: i % 3 === 0 ? 'Light rain' : 'Clear sky', icon: i % 3 === 0 ? '10d' : '01d' }] })), alerts: [] }
}

async function getJson(url) { const response = await fetch(url); if (!response.ok) throw new Error(response.status === 404 ? 'not-found' : 'api'); return response.json() }
export async function geocode(query) {
  if (!query.trim()) return []
  if (!key) return [{ name: query.trim().split(',')[0], state: 'Demo forecast', country: 'Weatherly', lat: 14.5995, lon: 120.9842 }]
  return getJson(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${key}`)
}
export async function reverseGeocode(lat, lon) {
  if (!key) return { name: 'Manila', state: 'Metro Manila', country: 'PH', lat, lon }
  const result = await getJson(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${key}`); return result[0]
}
export async function getWeather(place, units = 'metric') {
  const stored = localStorage.getItem(cacheKey(place.lat, place.lon, units))
  if (!key) return demo(place, units)
  const [current, forecast, air] = await Promise.all([
    getJson(`https://api.openweathermap.org/data/2.5/weather?lat=${place.lat}&lon=${place.lon}&units=${units}&appid=${key}`),
    getJson(`https://api.openweathermap.org/data/2.5/forecast?lat=${place.lat}&lon=${place.lon}&units=${units}&appid=${key}`),
    getJson(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${place.lat}&lon=${place.lon}&appid=${key}`).catch(() => null)
  ])
  const byDay = Object.values(forecast.list.reduce((acc, item) => { const day = new Date(item.dt * 1000).toDateString(); (acc[day] ||= []).push(item); return acc }, {})).slice(0, 8)
  const result = { location: { ...place, name: current.name, timezone: current.timezone }, current, hourly: forecast.list.slice(0, 12), daily: byDay.map(items => ({ ...items[0], dt: items[0].dt, temp: { max: Math.max(...items.map(x => x.main.temp_max)), min: Math.min(...items.map(x => x.main.temp_min)) }, pop: Math.max(...items.map(x => x.pop || 0)) })), alerts: [], air: air?.list?.[0] }
  localStorage.setItem(cacheKey(place.lat, place.lon, units), JSON.stringify(result)); return result
}
export function readCached(place, units) { try { return JSON.parse(localStorage.getItem(cacheKey(place.lat, place.lon, units))) } catch { return null } }
