import express from 'express';
import axios from 'axios';
import { weatherCache } from '../lib/cache';

const router = express.Router();
const WEATHER_API_KEY = process.env.WEATHERAPI_KEY;

// Get weather by coordinates
router.get('/', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const cacheKey = `weather:${lat}:${lon}`;
    let cached = weatherCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const response = await axios.get('http://api.weatherapi.com/v1/current.json', {
      params: {
        key: WEATHER_API_KEY,
        q: `${lat},${lon}`,
        aqi: 'no',
      },
    });

    const weatherData = {
      location: response.data.location,
      current: response.data.current,
      recommendations: getWeatherRecommendations(response.data.current),
    };

    weatherCache.set(cacheKey, weatherData);
    res.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Get weather by city name
router.get('/city', async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }

    const cacheKey = `weather:city:${city}`;
    let cached = weatherCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const response = await axios.get('http://api.weatherapi.com/v1/current.json', {
      params: {
        key: WEATHER_API_KEY,
        q: city,
        aqi: 'no',
      },
    });

    const weatherData = {
      location: response.data.location,
      current: response.data.current,
      recommendations: getWeatherRecommendations(response.data.current),
    };

    weatherCache.set(cacheKey, weatherData);
    res.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Helper function to generate weather-based recommendations
function getWeatherRecommendations(current: any) {
  const condition = current.condition.text.toLowerCase();
  const temp = current.temp_c;
  const isRaining = condition.includes('rain') || condition.includes('drizzle');
  const isCold = temp < 20;
  const isWarm = temp >= 24;
  const isClear = condition.includes('clear') || condition.includes('sunny');

  let genres = [];
  let mood = '';

  if (isRaining || isCold) {
    genres = ['drama', 'romance', 'comedy'];
    mood = 'cozy';
  } else if (isClear && isWarm) {
    genres = ['comedy', 'adventure', 'action'];
    mood = 'energetic';
  } else {
    genres = ['drama', 'thriller', 'mystery'];
    mood = 'contemplative';
  }

  return {
    genres,
    mood,
    temperature: temp,
    condition: current.condition.text,
  };
}

export default router;
