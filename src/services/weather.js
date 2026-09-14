const key = import.meta.env.VITE_OPENWEATHER_API_KEY
const cacheKey = (lat, lon, units) => `weatherly:${lat.toFixed(2)}:${lon.toFixed(2)}:${units}`

export function countryName(country) {
  if (!country) return ''
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(country.toUpperCase()) || country
  } catch {
    return country.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase())
  }
}

const normalizePlace = place => ({ ...place, country: countryName(place.country) })

export const conditionMeta = (id = 800, icon = '') => {
  const night = icon.endsWith('n')
  if (id >= 200 && id < 300) return { category: 'thunderstorm', label: 'Thunderstorms', symbol: '⛈️', image: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=1200&q=80' }
  if (id >= 300 && id < 400) return { category: 'rain', label: 'Drizzle', symbol: '🌦️', image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=80' }
  if (id >= 500 && id < 600) return { category: 'rain', label: 'Rain', symbol: '🌧️', image: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1200&q=80' }
  if (id >= 600 && id < 700) return { category: 'snow', label: 'Snow', symbol: '❄️', image: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1200&q=80' }
  if (id >= 700 && id < 800) return { category: 'atmosphere', label: 'Hazy', symbol: '🌫️', image: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=1200&q=80' }
  if (id === 800) return { category: night ? 'night' : 'clear', label: night ? 'Clear night' : 'Clear sky', symbol: night ? '🌙' : '☀️', image: night ? 'https://images.unsplash.com/photo-1534791547706-4a575e1f9f2c?auto=format&fit=crop&w=1200&q=80' : 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80' }
  return { category: 'clouds', label: id > 802 ? 'Overcast' : 'Partly cloudy', symbol: '⛅', image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80' }
}

async function getJson(url) { const response = await fetch(url); if (!response.ok) throw new Error(response.status === 404 ? 'not-found' : 'api'); return response.json() }
export async function geocode(query) {
  if (!query.trim()) return []
  if (!key) throw new Error('missing-api-key')
  return (await getJson(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${key}`)).map(normalizePlace)
}
export async function reverseGeocode(lat, lon) {
  if (!key) throw new Error('missing-api-key')
  const result = await getJson(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${key}`); return normalizePlace(result[0])
}
export async function getWeather(place, units = 'metric') {
  if (!key) throw new Error('missing-api-key')
  const [current, forecast, air] = await Promise.all([
    getJson(`https://api.openweathermap.org/data/2.5/weather?lat=${place.lat}&lon=${place.lon}&units=${units}&appid=${key}`),
    getJson(`https://api.openweathermap.org/data/2.5/forecast?lat=${place.lat}&lon=${place.lon}&units=${units}&appid=${key}`),
    getJson(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${place.lat}&lon=${place.lon}&appid=${key}`).catch(() => null)
  ])
  const byDay = Object.values(forecast.list.reduce((acc, item) => { const day = new Date(item.dt * 1000).toDateString(); (acc[day] ||= []).push(item); return acc }, {})).slice(0, 8)
  const result = { location: normalizePlace({ ...place, name: current.name, timezone: current.timezone }), current, hourly: forecast.list.slice(0, 12), daily: byDay.map(items => ({ ...items[0], dt: items[0].dt, temp: { max: Math.max(...items.map(x => x.main.temp_max)), min: Math.min(...items.map(x => x.main.temp_min)) }, pop: Math.max(...items.map(x => x.pop || 0)) })), alerts: [], air: air?.list?.[0] }
  localStorage.setItem(cacheKey(place.lat, place.lon, units), JSON.stringify(result)); return result
}
export function readCached(place, units) { try { return JSON.parse(localStorage.getItem(cacheKey(place.lat, place.lon, units))) } catch { return null } }
