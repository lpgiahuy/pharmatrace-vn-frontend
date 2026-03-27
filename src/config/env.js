export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  APP_NAME:     import.meta.env.VITE_APP_NAME    || 'PharmaChain',
  APP_VERSION:  import.meta.env.VITE_APP_VERSION || '1.0.0',
  USE_MOCK:     import.meta.env.VITE_USE_MOCK === 'true',
  REFRESH_TOKEN_THRESHOLD: Number(import.meta.env.VITE_REFRESH_TOKEN_THRESHOLD) || 300000,
}
