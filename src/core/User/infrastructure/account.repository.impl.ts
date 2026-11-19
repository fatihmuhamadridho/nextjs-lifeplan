import { lifePlanApi } from '@services/axios.service';
import type { AccountResponse, AuthSession, ChangePasswordInput, LoginInput, ProfileUpdateInput, RegisterInput } from '../domain/account.interface';
import { AccountRepository } from '../domain/account.repository';

export class AccountRepositoryImpl extends AccountRepository {
  register(input: RegisterInput) {
    return lifePlanApi.post<AuthSession, RegisterInput>('/auth/register', input);
  }
  login(input: LoginInput) {
    return lifePlanApi.post<AuthSession, LoginInput>('/auth/login', input);
  }
  getProfile() {
    return lifePlanApi.get<AccountResponse>('/me');
  }
  updateProfile(input: ProfileUpdateInput) {
    return lifePlanApi.patch<AccountResponse, ProfileUpdateInput>('/me', input);
  }
  changePassword(input: ChangePasswordInput) {
    return lifePlanApi.post<void, ChangePasswordInput>('/me/password', input);
  }
}
