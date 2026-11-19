import { lifePlanApi } from '@services/axios.service';
import type {
  SavedVisionResponse,
  VisionInput,
  VisionResponse,
  WishlistInput,
  WishlistItemResponse,
  WishlistResponse,
  WishlistUpdateInput,
} from '../domain/vision.interface';
import { VisionRepository } from '../domain/vision.repository';

export class VisionRepositoryImpl extends VisionRepository {
  get() {
    return lifePlanApi.get<VisionResponse>('/vision');
  }
  save(input: VisionInput) {
    return lifePlanApi.put<SavedVisionResponse, VisionInput>('/vision', input);
  }
  listWishlist() {
    return lifePlanApi.get<WishlistResponse>('/vision/wishlist');
  }
  createWishlistItem(input: WishlistInput) {
    return lifePlanApi.post<WishlistItemResponse, WishlistInput>('/vision/wishlist', input);
  }
  updateWishlistItem(id: string, input: WishlistUpdateInput) {
    return lifePlanApi.patch<WishlistItemResponse, WishlistUpdateInput>(`/vision/wishlist/${encodeURIComponent(id)}`, input);
  }
  deleteWishlistItem(id: string) {
    return lifePlanApi.delete<void>(`/vision/wishlist/${encodeURIComponent(id)}`);
  }
}
