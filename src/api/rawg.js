const BASE_URL = 'https://api.rawg.io/api';
const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

export async function fetchGames({ search = '', genres = '', platforms = '', ordering = '', page: pageOverride = null } = {}) {
  const hasFilters = Boolean(search || genres || platforms || ordering);
  const page = pageOverride ?? (hasFilters ? 1 : Math.floor(Math.random() * 50) + 1);

  const params = new URLSearchParams({
    key: API_KEY,
    page_size: '20',
    page: String(page),
  });

  if (search) params.append('search', search);
  if (genres) params.append('genres', genres);
  if (platforms) params.append('platforms', platforms);
  if (ordering) params.append('ordering', ordering);

  const response = await fetch(`${BASE_URL}/games?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Не удалось загрузить игры');
  }
  const data = await response.json();
  return data.results;
}

export async function fetchGameDetails(id) {
  const response = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);
  if (!response.ok) {
    throw new Error('Не удалось загрузить информацию об игре');
  }
  return response.json();
}

export async function fetchGenres() {
  const response = await fetch(`${BASE_URL}/genres?key=${API_KEY}`);
  if (!response.ok) {
    throw new Error('Не удалось загрузить жанры');
  }
  const data = await response.json();
  return data.results;
}

export async function fetchPlatforms() {
  const response = await fetch(`${BASE_URL}/platforms/lists/parents?key=${API_KEY}`);
  if (!response.ok) {
    throw new Error('Не удалось загрузить платформы');
  }
  const data = await response.json();
  return data.results;
}