import { LRUCache } from 'lru-cache';

// Cache for API responses (5 minutes TTL)
export const apiCache = new LRUCache<string, any>({
  max: 500,
  ttl: 5 * 60 * 1000, // 5 minutes
});

// Cache for weather data (10 minutes TTL)
export const weatherCache = new LRUCache<string, any>({
  max: 100,
  ttl: 10 * 60 * 1000, // 10 minutes
});

// Cache for TMDB data (15 minutes TTL)
export const tmdbCache = new LRUCache<string, any>({
  max: 1000,
  ttl: 15 * 60 * 1000, // 15 minutes
});
