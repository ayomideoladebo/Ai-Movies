import { useParams, Link } from 'react-router-dom'
import { Play, Star, Calendar, Clock, Users, Heart, Plus, Tv } from 'lucide-react'
import useSWR from 'swr'
import { getTVDetails } from '../services/api'
import { TVCard } from '../components/TVCard'
import { useAuth } from '../contexts/AuthContext'

export const TVDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { user, updateWatchlist } = useAuth()
  
  const { data: tv, error } = useSWR(
    id ? `tv-${id}` : null,
    () => id ? getTVDetails(id) : null
  )

  const handleAddToWatchlist = async () => {
    if (!user || !tv) return
    
    const currentWatchlist = user.watchlist || []
    const isInWatchlist = currentWatchlist.some((item: any) => item.id === tv.id)
    
    if (isInWatchlist) {
      const updatedWatchlist = currentWatchlist.filter((item: any) => item.id !== tv.id)
      await updateWatchlist(updatedWatchlist)
    } else {
      const updatedWatchlist = [...currentWatchlist, {
        id: tv.id,
        name: tv.name,
        poster_path: tv.poster_path,
        first_air_date: tv.first_air_date,
        media_type: 'tv'
      }]
      await updateWatchlist(updatedWatchlist)
    }
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-4">TV Show Not Found</h2>
          <p className="text-white/60 mb-6">The TV show you're looking for doesn't exist.</p>
          <Link to="/" className="glass-button">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  if (!tv) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto"></div>
      </div>
    )
  }

  const isInWatchlist = user?.watchlist?.some((item: any) => item.id === tv.id) || false

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
                  src={tv.poster_path ? `https://image.tmdb.org/t/p/w500${tv.poster_path}` : '/placeholder-movie.jpg'}
                  alt={tv.name}
                  className="w-full rounded-lg shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
                <div className="absolute top-4 left-4 glass-card px-3 py-1 flex items-center space-x-1">
                  <Tv className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">TV Series</span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-heading font-bold text-white mb-4">
                  {tv.name}
                </h1>
                <div className="flex items-center space-x-4 text-white/80 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{tv.vote_average.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(tv.first_air_date).getFullYear()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{tv.number_of_seasons} season{tv.number_of_seasons !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {tv.genres?.map((genre: any) => (
                  <span key={genre.id} className="glass-button text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>

              <p className="text-white/80 text-lg leading-relaxed">
                {tv.overview}
              </p>

              <div className="flex items-center space-x-4">
                {tv.seasons && tv.seasons.length > 0 && (
                  <Link
                    to={`/watch/tv/${tv.id}/season/${tv.seasons[0].season_number}/episode/1`}
                    className="glass-button flex items-center space-x-2 px-6 py-3 text-lg"
                  >
                    <Play className="w-5 h-5" />
                    <span>Watch Now</span>
                  </Link>
                )}

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

      {/* Seasons */}
      {tv.seasons && (
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl font-heading font-bold text-white mb-8">Seasons</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tv.seasons.map((season: any) => (
                <div key={season.id} className="glass-card p-4">
                  <div className="aspect-[2/3] bg-white/10 rounded-lg mb-4 overflow-hidden">
                    {season.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${season.poster_path}`}
                        alt={season.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/40">
                        <Tv className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-white font-semibold mb-2">{season.name}</h3>
                  <p className="text-white/60 text-sm mb-3">
                    {season.episode_count} episode{season.episode_count !== 1 ? 's' : ''}
                  </p>
                  {season.overview && (
                    <p className="text-white/70 text-sm line-clamp-3 mb-4">
                      {season.overview}
                    </p>
                  )}
                  <Link
                    to={`/watch/tv/${tv.id}/season/${season.season_number}/episode/1`}
                    className="glass-button w-full text-center py-2"
                  >
                    Watch Season
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cast */}
      {tv.credits?.cast && (
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl font-heading font-bold text-white mb-8">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {tv.credits.cast.slice(0, 12).map((actor: any) => (
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

      {/* Similar TV Shows */}
      {tv.similar?.results && (
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl font-heading font-bold text-white mb-8">Similar TV Shows</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {tv.similar.results.slice(0, 10).map((similarTV: any) => (
                <TVCard key={similarTV.id} tv={similarTV} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
