'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { VisionController } from '../domain/vision.controller';
import type { VisionInput, WishlistInput, WishlistUpdateInput } from '../domain/vision.interface';

const controller = new VisionController();
const visionKey = ['vision'] as const;
const wishlistKey = ['vision', 'wishlist'] as const;

export function useGetVision() {
  return useQuery({ queryKey: visionKey, queryFn: () => controller.get() });
}
export function useListWishlist() {
  return useQuery({ queryKey: wishlistKey, queryFn: () => controller.listWishlist() });
}
export function useSaveVision() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: VisionInput) => controller.save(input),
    onSuccess: () => client.invalidateQueries({ queryKey: visionKey }),
  });
}
export function useCreateWishlistItem() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: WishlistInput) => controller.createWishlistItem(input),
    onSuccess: () => client.invalidateQueries({ queryKey: wishlistKey }),
  });
}
export function useUpdateWishlistItem() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: WishlistUpdateInput }) => controller.updateWishlistItem(id, input),
    onSuccess: () => client.invalidateQueries({ queryKey: wishlistKey }),
  });
}
export function useDeleteWishlistItem() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => controller.deleteWishlistItem(id),
    onSuccess: () => client.invalidateQueries({ queryKey: wishlistKey }),
  });
}
