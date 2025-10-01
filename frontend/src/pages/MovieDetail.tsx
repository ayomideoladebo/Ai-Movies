import { useParams, Link } from 'react-router-dom'
import { Play, Star, Calendar, Clock, Users, Heart, Plus } from 'lucide-react'
import useSWR from 'swr'
import { getMovieDetails } from '../services/api'
import { MovieCard } from '../components/MovieCard'
import { useAuth } from '../contexts/AuthContext'

export const MovieDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { user, updateWatchlist } = useAuth()
  
  const { data: movie, error } = useSWR(
    id ? `movie-${id}` : null,
    () => id ? getMovieDetails(id) : null
  )

  const handleAddToWatchlist = async () => {
    if (!user || !movie) return
    
    const currentWatchlist = user.watchlist || []
    const isInWatchlist = currentWatchlist.some((item: any) => item.id === movie.id)
    
    if (isInWatchlist) {
      const updatedWatchlist = currentWatchlist.filter((item: any) => item.id !== movie.id)
      await updateWatchlist(updatedWatchlist)
    } else {
      const updatedWatchlist = [...currentWatchlist, {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        media_type: 'movie'
      }]
      await updateWatchlist(updatedWatchlist)
    }
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="glass-card p-8">
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
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto"></div>
      </div>
    )
  }

  const isInWatchlist = user?.watchlist?.some((item: any) => item.id === movie.id) || false

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Poster */}
            <div className="lg:col-span-1">
              <div className="relative">
                <img
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-movie.jpg'}
                  alt={movie.title}
                  className="w-full rounded-lg shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-heading font-bold text-white mb-4">
                  {movie.title}
                </h1>
                <div className="flex items-center space-x-4 text-white/80 mb-4">
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

              <div className="flex flex-wrap gap-2">
                {movie.genres?.map((genre: any) => (
                  <span key={genre.id} className="glass-button text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>

              <p className="text-white/80 text-lg leading-relaxed">
                {movie.overview}
              </p>

              <div className="flex items-center space-x-4">
                <Link
                  to={`/watch/movie/${movie.id}`}
                  className="glass-button flex items-center space-x-2 px-6 py-3 text-lg"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Now</span>
                </Link>

                {user && (
                  <button
                    onClick={handleAddToWatchlist}
                    className={`glass-button flex items-center space-x-2 px-6 py-3 ${
                      isInWatchlist ? 'bg-red-500/20 border-red-500/30' : ''
                    }`}
                  >
                    {isInWatchlist ? (
                      <>
                        <Heart className="w-5 h-5 fill-current" />
                        <span>Remove from Watchlist</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>Add to Watchlist</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cast */}
      {movie.credits?.cast && (
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl font-heading font-bold text-white mb-8">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.credits.cast.slice(0, 12).map((actor: any) => (
                <div key={actor.id} className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-2 overflow-hidden">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/40">
                        <Users className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <p className="text-white text-sm font-medium">{actor.name}</p>
                  <p className="text-white/60 text-xs">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Similar Movies */}
      {movie.similar?.results && (
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl font-heading font-bold text-white mb-8">Similar Movies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movie.similar.results.slice(0, 10).map((similarMovie: any) => (
                <MovieCard key={similarMovie.id} movie={similarMovie} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
