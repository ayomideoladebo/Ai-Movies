import { Link } from 'react-router-dom'
import { Play, Star, Calendar } from 'lucide-react'

interface MovieCardProps {
  movie: {
    id: number
    title: string
    poster_path: string | null
    release_date: string
    vote_average: number
    overview: string
    genre_ids?: number[]
  }
  showPlayButton?: boolean
}

export const MovieCard = ({ movie, showPlayButton = true }: MovieCardProps) => {
  const getImageUrl = (path: string | null) => {
    if (!path) return '/placeholder-movie.jpg'
    return `https://image.tmdb.org/t/p/w500${path}`
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return new Date(dateString).getFullYear()
  }

  const formatRating = (rating: number) => {
    return rating.toFixed(1)
  }

  return (
    <div className="movie-card group">
      <div className="relative overflow-hidden rounded-lg mb-3">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-movie.jpg'
          }}
        />
        
        {showPlayButton && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Link
              to={`/watch/movie/${movie.id}`}
              className="glass-button flex items-center space-x-2 px-6 py-3"
            >
              <Play className="w-5 h-5" />
              <span>Watch Now</span>
            </Link>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <div className="glass-card px-2 py-1 flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs font-medium text-white">
              {formatRating(movie.vote_average)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Link to={`/movie/${movie.id}`}>
          <h3 className="text-white font-semibold text-lg line-clamp-2 group-hover:text-primary-300 transition-colors">
            {movie.title}
          </h3>
        </Link>

        <div className="flex items-center space-x-4 text-white/60 text-sm">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(movie.release_date)}</span>
          </div>
        </div>

        {movie.overview && (
          <p className="text-white/70 text-sm line-clamp-3">
            {movie.overview}
          </p>
        )}
      </div>
    </div>
  )
}
