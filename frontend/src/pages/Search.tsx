import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, Grid, List } from 'lucide-react'
import useSWR from 'swr'
import { searchContent, discoverContent } from '../services/api'
import { MovieCard } from '../components/MovieCard'
import { TVCard } from '../components/TVCard'

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [filters, setFilters] = useState({
    type: 'multi',
    genre: '',
    year: '',
    sort: 'popularity.desc'
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const { data: searchResults, error } = useSWR(
    query ? `search-${query}-${JSON.stringify(filters)}` : null,
    () => {
      if (query) {
        return searchContent(query)
      } else {
        return discoverContent(filters.type, filters)
      }
    }
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setSearchParams({ q: query })
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      type: 'multi',
      genre: '',
      year: '',
      sort: 'popularity.desc'
    })
    setQuery('')
    setSearchParams({})
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-6">
            {query ? `Search Results for "${query}"` : 'Discover Content'}
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search movies and TV shows..."
                  className="glass-input w-full pl-10 pr-4"
                />
              </div>
              <button type="submit" className="glass-button px-6">
                Search
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-white/60" />
                <span className="text-white font-medium">Filters</span>
              </div>
              <button
                onClick={clearFilters}
                className="text-white/60 hover:text-white text-sm"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="glass-input w-full"
                >
                  <option value="multi">All</option>
                  <option value="movie">Movies</option>
                  <option value="tv">TV Shows</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Genre
                </label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="glass-input w-full"
                >
                  <option value="">All Genres</option>
                  <option value="28">Action</option>
                  <option value="35">Comedy</option>
                  <option value="18">Drama</option>
                  <option value="27">Horror</option>
                  <option value="10749">Romance</option>
                  <option value="878">Science Fiction</option>
                  <option value="53">Thriller</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Year
                </label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="glass-input w-full"
                >
                  <option value="">All Years</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="glass-input w-full"
                >
                  <option value="popularity.desc">Popularity</option>
                  <option value="vote_average.desc">Rating</option>
                  <option value="release_date.desc">Release Date</option>
                  <option value="title.asc">Title A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {error && (
          <div className="glass-card p-8 text-center">
            <p className="text-white/60">Failed to load search results</p>
          </div>
        )}

        {searchResults?.results?.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/80">
                Found {searchResults.total_results} results
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'grid' ? 'bg-primary-500/20' : 'glass-button'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'list' ? 'bg-primary-500/20' : 'glass-button'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
                : 'space-y-4'
            }>
              {searchResults.results.map((item: any) => (
                <div key={item.id}>
                  {item.media_type === 'movie' || item.media_type === undefined ? (
                    <MovieCard movie={item} />
                  ) : (
                    <TVCard tv={item} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {searchResults?.results?.length === 0 && (
          <div className="glass-card p-8 text-center">
            <p className="text-white/60 text-lg mb-4">No results found</p>
            <p className="text-white/40">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
