import { LocalStorageService } from '@services/localStorage.service';
import { CookiesStorageService } from '@services/cookiesStorage.service';
import { LIFEPLAN_ACCESS_TOKEN_KEY } from '@configs/base.config';
import type { AuthSession, LoginInput, RegisterInput } from './account.interface';
import type { AccountRepository } from './account.repository';

export class AuthUseCase {
  private readonly storage = new LocalStorageService();
  private readonly cookies = new CookiesStorageService();

  constructor(private readonly repository: AccountRepository) {}

  private saveSession(session: AuthSession): void {
    try {
      this.storage.set(LIFEPLAN_ACCESS_TOKEN_KEY, session.token);
    } catch {
      // The cookie also carries the session in standalone browsers.
    }
    this.cookies.set(LIFEPLAN_ACCESS_TOKEN_KEY, session.token, {
      maxAge: session.expiresIn,
      sameSite: 'lax',
      secure: window.location.protocol === 'https:',
    });
  }

  async register(input: RegisterInput): Promise<AuthSession> {
    const session = await this.repository.register(input);
    this.saveSession(session);
    return session;
  }

  async login(input: LoginInput): Promise<AuthSession> {
    const session = await this.repository.login(input);
    this.saveSession(session);
    return session;
  }

  logout(): void {
    try {
      this.storage.delete(LIFEPLAN_ACCESS_TOKEN_KEY);
    } catch {
      // Storage may be unavailable in standalone browsers.
    }
    this.cookies.delete(LIFEPLAN_ACCESS_TOKEN_KEY);
  }
}
