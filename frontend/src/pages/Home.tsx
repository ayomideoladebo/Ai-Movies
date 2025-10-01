import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, TrendingUp, Sparkles, Cloud, Star } from 'lucide-react'
import useSWR from 'swr'
import { getTrending, getWeather, chatWithGemini } from '../services/api'
import { MovieCard } from '../components/MovieCard'
import { TVCard } from '../components/TVCard'
import { WeatherBadge } from '../components/WeatherBadge'
import { GeminiChatAssistant } from '../components/GeminiChatAssistant'

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)
  const navigate = useNavigate()

  // Get trending content
  const { data: trendingMovies } = useSWR('trending-movies', () => getTrending('movie', 'week'))
  const { data: trendingTV } = useSWR('trending-tv', () => getTrending('tv', 'week'))

  // Get weather data
  const { data: weatherData } = useSWR(
    userLocation ? `weather-${userLocation.lat}-${userLocation.lon}` : null,
    () => userLocation ? getWeather(userLocation.lat, userLocation.lon) : null
  )

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        },
        (error) => {
          console.log('Geolocation error:', error)
        }
      )
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
            Discover Your Next
            <span className="hero-gradient bg-clip-text text-transparent"> Favorite Movie</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            AI-powered recommendations based on your mood, weather, and preferences
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies and TV shows..."
                className="glass-input w-full pl-12 pr-4 py-4 text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 glass-button px-6 py-2"
              >
                Search
              </button>
            </div>
          </form>

          {/* Weather Badge */}
          {weatherData && <WeatherBadge weather={weatherData} />}
        </div>
      </section>

      {/* Trending Movies */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <TrendingUp className="w-6 h-6 text-primary-400" />
            <h2 className="text-2xl font-heading font-bold text-white">Trending Movies</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {trendingMovies?.results?.slice(0, 10).map((movie: any) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending TV Shows */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <Star className="w-6 h-6 text-primary-400" />
            <h2 className="text-2xl font-heading font-bold text-white">Trending TV Shows</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {trendingTV?.results?.slice(0, 10).map((tv: any) => (
              <TVCard key={tv.id} tv={tv} />
            ))}
          </div>
        </div>
      </section>

      {/* Weather-based Recommendations */}
      {weatherData && (
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="flex items-center space-x-3 mb-8">
              <Cloud className="w-6 h-6 text-primary-400" />
              <h2 className="text-2xl font-heading font-bold text-white">
                Perfect for {weatherData.recommendations.mood} weather
              </h2>
            </div>
            
            <div className="glass-card p-6">
              <p className="text-white/80 mb-4">
                Based on the current weather in your location, we recommend these genres:
              </p>
              <div className="flex flex-wrap gap-2">
                {weatherData.recommendations.genres.map((genre: string) => (
                  <span
                    key={genre}
                    className="glass-button text-sm capitalize"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gemini Chat Assistant */}
      <GeminiChatAssistant />
    </div>
  )
}
