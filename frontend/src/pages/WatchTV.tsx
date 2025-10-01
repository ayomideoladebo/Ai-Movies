import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, Calendar, Clock, Tv } from 'lucide-react'
import useSWR from 'swr'
import { getTVDetails } from '../services/api'
import { PlayerEmbed } from '../components/PlayerEmbed'

export const WatchTV = () => {
  const { id, season, episode } = useParams<{ 
    id: string
    season: string
    episode: string
  }>()
  
  const { data: tv, error } = useSWR(
    id ? `tv-${id}` : null,
    () => id ? getTVDetails(id) : null
  )

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full"></div>
      </div>
    )
  }

  const currentSeason = tv.seasons?.find((s: any) => s.season_number === parseInt(season || '1'))
  const currentEpisode = currentSeason?.episodes?.find((e: any) => e.episode_number === parseInt(episode || '1'))

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-card border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to={`/tv/${tv.id}`}
              className="glass-button flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Series</span>
            </Link>

            <div className="flex items-center space-x-4 text-white/80">
              <div className="flex items-center space-x-1">
                <Tv className="w-4 h-4 text-blue-400" />
                <span>Season {season}, Episode {episode}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{tv.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(tv.first_air_date).getFullYear()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Player */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">
            {tv.name}
          </h1>
          <h2 className="text-xl text-white/80 mb-2">
            Season {season}, Episode {episode}
            {currentEpisode?.name && `: ${currentEpisode.name}`}
          </h2>
          {currentEpisode?.overview && (
            <p className="text-white/80 text-lg">
              {currentEpisode.overview}
            </p>
          )}
        </div>

        <PlayerEmbed
          tmdbId={parseInt(id!)}
          type="tv"
          season={parseInt(season!)}
          episode={parseInt(episode!)}
        />

        {/* Episode Navigation */}
        {currentSeason?.episodes && (
          <div className="mt-8">
            <h3 className="text-xl font-heading font-bold text-white mb-4">
              Season {season} Episodes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentSeason.episodes.map((ep: any) => (
                <Link
                  key={ep.id}
                  to={`/watch/tv/${tv.id}/season/${season}/episode/${ep.episode_number}`}
                  className={`glass-card p-4 transition-all ${
                    ep.episode_number === parseInt(episode || '1')
                      ? 'ring-2 ring-primary-500 bg-primary-500/20'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">
                        {ep.episode_number}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium line-clamp-1">
                        {ep.name}
                      </h4>
                      <p className="text-white/60 text-sm">
                        {ep.runtime} min
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
