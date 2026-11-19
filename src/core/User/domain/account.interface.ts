import type { DataResponse } from '@interfaces/api.interface';

export type Account = {
  id: string;
  name: string;
  email: string;
  motto: string;
  createdAt: string;
  updatedAt: string;
};
export type AuthSession = { data: Account; token: string; tokenType: 'Bearer'; expiresIn: number };
export type RegisterInput = { name: string; email: string; password: string };
export type LoginInput = { email: string; password: string };
export type ProfileUpdateInput = Partial<Pick<Account, 'name' | 'email' | 'motto'>>;
export type ChangePasswordInput = { currentPassword: string; newPassword: string };
export type AccountResponse = DataResponse<Account>;
