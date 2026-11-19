import { AccountRepositoryImpl } from '../infrastructure/account.repository.impl';
import type { AccountRepository } from './account.repository';
import { AuthUseCase } from './auth.usecase';

export class AccountController {
  readonly authUseCase: AuthUseCase;

  constructor(private readonly repository: AccountRepository = new AccountRepositoryImpl()) {
    this.authUseCase = new AuthUseCase(repository);
  }

  register(...args: Parameters<AccountRepository['register']>) {
    return this.authUseCase.register(...args);
  }
  login(...args: Parameters<AccountRepository['login']>) {
    return this.authUseCase.login(...args);
  }
  getProfile(...args: Parameters<AccountRepository['getProfile']>) {
    return this.repository.getProfile(...args);
  }
  updateProfile(...args: Parameters<AccountRepository['updateProfile']>) {
    return this.repository.updateProfile(...args);
  }
  changePassword(...args: Parameters<AccountRepository['changePassword']>) {
    return this.repository.changePassword(...args);
  }

  logout() {
    this.authUseCase.logout();
  }
}

export const accountController = new AccountController();
