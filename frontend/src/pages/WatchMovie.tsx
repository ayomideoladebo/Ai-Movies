import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, Calendar, Clock } from 'lucide-react'
import useSWR from 'swr'
import { getMovieDetails } from '../services/api'
import { PlayerEmbed } from '../components/PlayerEmbed'

export const WatchMovie = () => {
  const { id } = useParams<{ id: string }>()
  
  const { data: movie, error } = useSWR(
    id ? `movie-${id}` : null,
    () => id ? getMovieDetails(id) : null
  )

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Movie Not Found</h2>
          <p className="text-white/60 mb-6">The movie you're looking for doesn't exist.</p>
          <Link to="/" className="glass-button">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-card border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to={`/movie/${movie.id}`}
              className="glass-button flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Movie</span>
            </Link>

            <div className="flex items-center space-x-4 text-white/80">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{movie.runtime} min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Player */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">
            {movie.title}
          </h1>
          <p className="text-white/80 text-lg">
            {movie.overview}
          </p>
        </div>

        <PlayerEmbed
          tmdbId={movie.id}
          type="movie"
        />
      </div>
    </div>
  )
}
