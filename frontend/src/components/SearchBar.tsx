import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Film, Tv } from 'lucide-react'
import useSWR from 'swr'
import { searchContent } from '../services/api'

interface SearchBarProps {
  onClose: () => void
}

export const SearchBar = ({ onClose }: SearchBarProps) => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const { data, error } = useSWR(
    query.length > 2 ? `search:${query}` : null,
    () => searchContent(query)
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`)
      onClose()
    }
  }

  const handleItemClick = (item: any) => {
    if (item.media_type === 'movie') {
      navigate(`/movie/${item.id}`)
    } else if (item.media_type === 'tv') {
      navigate(`/tv/${item.id}`)
    }
    onClose()
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20">
      <div className="glass-card w-full max-w-2xl mx-4 max-h-[70vh] overflow-hidden">
        <div className="p-4 border-b border-white/20">
          <form onSubmit={handleSearch} className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies and TV shows..."
                className="glass-input w-full pl-10 pr-4"
                autoFocus
              />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="glass-button p-2"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {query.length > 2 && (
            <>
              {error && (
                <div className="p-4 text-center text-white/60">
                  Failed to load search results
                </div>
              )}
              
              {data?.results?.length > 0 ? (
                <div className="p-2">
                  {data.results.slice(0, 10).map((item: any) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-white/10 transition-colors rounded-lg"
                    >
                      <div className="w-12 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                        {item.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                            alt={item.title || item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-white/40">
                            {item.media_type === 'movie' ? <Film className="w-6 h-6" /> : <Tv className="w-6 h-6" />}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-white font-medium">
                          {item.title || item.name}
                        </h3>
                        <p className="text-white/60 text-sm">
                          {item.media_type === 'movie' ? 'Movie' : 'TV Show'} • {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}
                        </p>
                        {item.overview && (
                          <p className="text-white/40 text-xs mt-1 line-clamp-2">
                            {item.overview}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : query.length > 2 && !data && (
                <div className="p-4 text-center text-white/60">
                  <div className="animate-spin w-6 h-6 border-2 border-white/20 border-t-white rounded-full mx-auto mb-2"></div>
                  Searching...
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
