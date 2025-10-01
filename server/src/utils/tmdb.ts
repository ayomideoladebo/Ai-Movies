// Helper function to filter out future releases
export const filterFutureReleases = (items: any[]) => {
  const today = new Date().toISOString().split('T')[0];
  return items.filter(item => {
    if (!item.release_date) return true;
    return item.release_date <= today;
  });
};

// Helper function to format TMDB image URLs
export const getImageUrl = (path: string | null, size: 'w200' | 'w300' | 'w500' | 'original' = 'w500') => {
  if (!path) return '/placeholder-movie.jpg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Helper function to get VidFast embed URL
export const getVidFastEmbedUrl = (tmdbId: number, type: 'movie' | 'tv', season?: number, episode?: number) => {
  const baseUrl = 'https://vidfast.pro';
  
  if (type === 'movie') {
    return `${baseUrl}/movie/${tmdbId}?autoPlay=true`;
  } else if (type === 'tv' && season && episode) {
    return `${baseUrl}/tv/${tmdbId}/${season}/${episode}?autoPlay=true`;
  }
  
  return null;
};
