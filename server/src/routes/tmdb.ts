import express from 'express';
import axios from 'axios';
import { tmdbCache } from '../lib/cache';

const router = express.Router();
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_KEY = process.env.TMDB_KEY;

// Helper function to filter out future releases
const filterFutureReleases = (items: any[]) => {
  const today = new Date().toISOString().split('T')[0];
  return items.filter(item => {
    if (!item.release_date) return true;
    return item.release_date <= today;
  });
};

// Search movies and TV shows
router.get('/search', async (req, res) => {
  try {
    const { q, type = 'multi', page = 1 } = req.query;
    const cacheKey = `search:${q}:${type}:${page}`;
    
    let cached = tmdbCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const response = await axios.get(`${TMDB_BASE_URL}/search/${type}`, {
      params: {
        api_key: TMDB_KEY,
        query: q,
        page,
      },
    });

    let results = response.data.results;
    
    // Filter out future releases for movies
    if (type === 'movie' || type === 'multi') {
      results = filterFutureReleases(results);
    }

    const data = { ...response.data, results };
    tmdbCache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('TMDB search error:', error);
    res.status(500).json({ error: 'Failed to search TMDB' });
  }
});

// Get movie details
router.get('/movie/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `movie:${id}`;
    
    let cached = tmdbCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const [movie, credits, videos] = await Promise.all([
      axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
        params: { api_key: TMDB_KEY },
      }),
      axios.get(`${TMDB_BASE_URL}/movie/${id}/credits`, {
        params: { api_key: TMDB_KEY },
      }),
      axios.get(`${TMDB_BASE_URL}/movie/${id}/videos`, {
        params: { api_key: TMDB_KEY },
      }),
    ]);

    const data = {
      ...movie.data,
      credits: credits.data,
      videos: videos.data,
    };

    tmdbCache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('TMDB movie error:', error);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

// Get TV show details
router.get('/tv/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `tv:${id}`;
    
    let cached = tmdbCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const [tv, credits, videos] = await Promise.all([
      axios.get(`${TMDB_BASE_URL}/tv/${id}`, {
        params: { api_key: TMDB_KEY },
      }),
      axios.get(`${TMDB_BASE_URL}/tv/${id}/credits`, {
        params: { api_key: TMDB_KEY },
      }),
      axios.get(`${TMDB_BASE_URL}/tv/${id}/videos`, {
        params: { api_key: TMDB_KEY },
      }),
    ]);

    const data = {
      ...tv.data,
      credits: credits.data,
      videos: videos.data,
    };

    tmdbCache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('TMDB TV error:', error);
    res.status(500).json({ error: 'Failed to fetch TV show details' });
  }
});

// Discover movies/TV with filters
router.get('/discover', async (req, res) => {
  try {
    const { type = 'movie', ...filters } = req.query;
    const cacheKey = `discover:${type}:${JSON.stringify(filters)}`;
    
    let cached = tmdbCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const response = await axios.get(`${TMDB_BASE_URL}/discover/${type}`, {
      params: {
        api_key: TMDB_KEY,
        ...filters,
      },
    });

    let results = response.data.results;
    
    // Filter out future releases for movies
    if (type === 'movie') {
      results = filterFutureReleases(results);
    }

    const data = { ...response.data, results };
    tmdbCache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('TMDB discover error:', error);
    res.status(500).json({ error: 'Failed to discover content' });
  }
});

// Get trending content
router.get('/trending', async (req, res) => {
  try {
    const { type = 'all', time_window = 'week', page = 1 } = req.query;
    const cacheKey = `trending:${type}:${time_window}:${page}`;
    
    let cached = tmdbCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const response = await axios.get(`${TMDB_BASE_URL}/trending/${type}/${time_window}`, {
      params: {
        api_key: TMDB_KEY,
        page,
      },
    });

    let results = response.data.results;
    
    // Filter out future releases for movies
    if (type === 'movie' || type === 'all') {
      results = filterFutureReleases(results);
    }

    const data = { ...response.data, results };
    tmdbCache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('TMDB trending error:', error);
    res.status(500).json({ error: 'Failed to fetch trending content' });
  }
});

export default router;
