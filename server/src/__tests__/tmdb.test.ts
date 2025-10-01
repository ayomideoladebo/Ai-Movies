import { filterFutureReleases } from '../utils/tmdb';

describe('TMDB Utils', () => {
  describe('filterFutureReleases', () => {
    it('should filter out movies with future release dates', () => {
      const today = new Date();
      const futureDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      const pastDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

      const movies = [
        {
          id: 1,
          title: 'Past Movie',
          release_date: pastDate.toISOString().split('T')[0],
        },
        {
          id: 2,
          title: 'Future Movie',
          release_date: futureDate.toISOString().split('T')[0],
        },
        {
          id: 3,
          title: 'Today Movie',
          release_date: today.toISOString().split('T')[0],
        },
        {
          id: 4,
          title: 'No Date Movie',
          release_date: null,
        },
      ];

      const filtered = filterFutureReleases(movies);

      expect(filtered).toHaveLength(3);
      expect(filtered.map(m => m.id)).toEqual([1, 3, 4]);
    });

    it('should handle empty array', () => {
      const filtered = filterFutureReleases([]);
      expect(filtered).toEqual([]);
    });

    it('should handle movies without release dates', () => {
      const movies = [
        { id: 1, title: 'Movie 1', release_date: null },
        { id: 2, title: 'Movie 2' },
      ];

      const filtered = filterFutureReleases(movies);
      expect(filtered).toHaveLength(2);
    });
  });
});
