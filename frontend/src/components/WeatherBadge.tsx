import { Cloud, Sun, CloudRain, Snow } from 'lucide-react'

interface WeatherBadgeProps {
  weather: {
    location: {
      name: string
      country: string
    }
    current: {
      temp_c: number
      condition: {
        text: string
        code: number
      }
    }
    recommendations: {
      mood: string
      genres: string[]
    }
  }
}

export const WeatherBadge = ({ weather }: WeatherBadgeProps) => {
  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase()
    
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return <CloudRain className="w-5 h-5" />
    } else if (conditionLower.includes('snow')) {
      return <Snow className="w-5 h-5" />
    } else if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
      return <Sun className="w-5 h-5" />
    } else {
      return <Cloud className="w-5 h-5" />
    }
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'cozy':
        return 'text-purple-400'
      case 'energetic':
        return 'text-yellow-400'
      case 'contemplative':
        return 'text-blue-400'
      default:
        return 'text-white'
    }
  }

  return (
    <div className="glass-card p-4 max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getWeatherIcon(weather.current.condition.text)}
          <div>
            <p className="text-white font-medium">
              {weather.location.name}, {weather.location.country}
            </p>
            <p className="text-white/60 text-sm">
              {weather.current.temp_c}°C • {weather.current.condition.text}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className={`text-sm font-medium ${getMoodColor(weather.recommendations.mood)}`}>
            {weather.recommendations.mood} mood
          </p>
          <p className="text-white/60 text-xs">
            Perfect for {weather.recommendations.genres.slice(0, 2).join(', ')}
          </p>
        </div>
      </div>
    </div>
  )
}
