import { LIFEPLAN_ACCESS_TOKEN_KEY } from '@configs/base.config';
import { CookiesStorageService } from './cookiesStorage.service';
import { localStorageService } from './localStorage.service';

const cookies = new CookiesStorageService();

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const token = localStorageService.get(LIFEPLAN_ACCESS_TOKEN_KEY);
    if (token) return token;
  } catch {
    // Cookies can still provide the session when browser storage is unavailable.
  }

  return cookies.get(LIFEPLAN_ACCESS_TOKEN_KEY);
}
