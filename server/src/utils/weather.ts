// Helper function to generate weather-based recommendations
export const getWeatherRecommendations = (current: any) => {
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
};
