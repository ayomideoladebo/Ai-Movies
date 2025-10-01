import { getWeatherRecommendations } from '../utils/weather';

describe('Weather Utils', () => {
  describe('getWeatherRecommendations', () => {
    it('should recommend cozy genres for rainy weather', () => {
      const weather = {
        condition: { text: 'Light rain' },
        temp_c: 15,
      };

      const recommendations = getWeatherRecommendations(weather);

      expect(recommendations.genres).toContain('drama');
      expect(recommendations.genres).toContain('romance');
      expect(recommendations.mood).toBe('cozy');
    });

    it('should recommend energetic genres for clear warm weather', () => {
      const weather = {
        condition: { text: 'Clear' },
        temp_c: 28,
      };

      const recommendations = getWeatherRecommendations(weather);

      expect(recommendations.genres).toContain('comedy');
      expect(recommendations.genres).toContain('adventure');
      expect(recommendations.mood).toBe('energetic');
    });

    it('should recommend contemplative genres for cold weather', () => {
      const weather = {
        condition: { text: 'Cloudy' },
        temp_c: 5,
      };

      const recommendations = getWeatherRecommendations(weather);

      expect(recommendations.genres).toContain('drama');
      expect(recommendations.genres).toContain('thriller');
      expect(recommendations.mood).toBe('cozy');
    });

    it('should handle edge cases', () => {
      const weather = {
        condition: { text: 'Sunny' },
        temp_c: 24,
      };

      const recommendations = getWeatherRecommendations(weather);

      expect(recommendations.genres).toBeDefined();
      expect(recommendations.mood).toBeDefined();
      expect(recommendations.temperature).toBe(24);
    });
  });
});
