'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAccessToken } from '@services/accessToken.service';
import { accountController } from '../domain/account.controller';
import type { ChangePasswordInput, LoginInput, ProfileUpdateInput, RegisterInput } from '../domain/account.interface';

const profileKey = ['account', 'profile'] as const;
const accountScopedQueryKeys = [['goals'], ['plans'], ['weeks'], ['tasks'], ['reports'], ['vision']] as const;

function clearAccountScopedQueries(client: ReturnType<typeof useQueryClient>) {
  accountScopedQueryKeys.forEach((queryKey) => client.removeQueries({ queryKey }));
}

export function useRegister() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterInput) => accountController.register(input),
    onSuccess: async () => {
      clearAccountScopedQueries(client);
      await client.invalidateQueries({ queryKey: profileKey });
    },
  });
}
export function useLogin() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => accountController.login(input),
    onSuccess: async () => {
      clearAccountScopedQueries(client);
      await client.invalidateQueries({ queryKey: profileKey });
    },
  });
}
export function useGetProfile(enabled = Boolean(getAccessToken())) {
  return useQuery({ queryKey: profileKey, queryFn: () => accountController.getProfile(), enabled });
}
export function useUpdateProfile() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: ProfileUpdateInput) => accountController.updateProfile(input),
    onSuccess: () => client.invalidateQueries({ queryKey: profileKey }),
  });
}
export function useChangePassword() {
  return useMutation({ mutationFn: (input: ChangePasswordInput) => accountController.changePassword(input) });
}
export function useLogout() {
  const client = useQueryClient();
  return () => {
    accountController.logout();
    clearAccountScopedQueries(client);
    client.removeQueries({ queryKey: profileKey });
  };
}
