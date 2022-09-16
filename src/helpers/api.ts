export const ECHOSTUDY_API_URL = process.env.ECHOSTUDY_API_URL ?? 'https://api.echostudy.com';

export function ensureHttps(url: string): string {
  return url.replace('http://', 'https://');
}
