import { useEffect, useState } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'

interface PlayerEmbedProps {
  tmdbId: number
  type: 'movie' | 'tv'
  season?: number
  episode?: number
}

export const PlayerEmbed = ({ tmdbId, type, season, episode }: PlayerEmbedProps) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const getEmbedUrl = () => {
    const baseUrl = 'https://vidfast.pro'
    
    if (type === 'movie') {
      return `${baseUrl}/movie/${tmdbId}?autoPlay=true`
    } else if (type === 'tv' && season && episode) {
      return `${baseUrl}/tv/${tmdbId}/${season}/${episode}?autoPlay=true`
    }
    
    return null
  }

  const embedUrl = getEmbedUrl()

  useEffect(() => {
    if (embedUrl) {
      setLoading(true)
      setError(false)
    }
  }, [embedUrl])

  const handleLoad = () => {
    setLoading(false)
  }

  const handleError = () => {
    setLoading(false)
    setError(true)
  }

  if (!embedUrl) {
    return (
      <div className="flex items-center justify-center h-96 glass-card">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white/80">Invalid video parameters</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-96 md:h-[500px] lg:h-[600px]">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center glass-card">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-primary-400 animate-spin mx-auto mb-4" />
            <p className="text-white/80">Loading player...</p>
          </div>
        </div>
      )}

      {error ? (
        <div className="flex items-center justify-center h-full glass-card">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-white/80 mb-2">Failed to load video</p>
            <p className="text-white/60 text-sm">
              The video may not be available or there might be a connection issue.
            </p>
          </div>
        </div>
      ) : (
        <iframe
          src={embedUrl}
          className="w-full h-full rounded-lg"
          allowFullScreen
          onLoad={handleLoad}
          onError={handleError}
          title={`${type === 'movie' ? 'Movie' : 'TV Show'} Player`}
        />
      )}
    </div>
  )
}
