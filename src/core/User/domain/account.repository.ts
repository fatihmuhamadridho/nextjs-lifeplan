import type { AccountResponse, AuthSession, ChangePasswordInput, LoginInput, ProfileUpdateInput, RegisterInput } from './account.interface';

export abstract class AccountRepository {
  abstract register(input: RegisterInput): Promise<AuthSession>;
  abstract login(input: LoginInput): Promise<AuthSession>;
  abstract getProfile(): Promise<AccountResponse>;
  abstract updateProfile(input: ProfileUpdateInput): Promise<AccountResponse>;
  abstract changePassword(input: ChangePasswordInput): Promise<void>;
}
