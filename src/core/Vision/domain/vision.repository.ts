import type {
  SavedVisionResponse,
  VisionInput,
  VisionResponse,
  WishlistInput,
  WishlistItemResponse,
  WishlistResponse,
  WishlistUpdateInput,
} from './vision.interface';

export abstract class VisionRepository {
  abstract get(): Promise<VisionResponse>;
  abstract save(input: VisionInput): Promise<SavedVisionResponse>;
  abstract listWishlist(): Promise<WishlistResponse>;
  abstract createWishlistItem(input: WishlistInput): Promise<WishlistItemResponse>;
  abstract updateWishlistItem(id: string, input: WishlistUpdateInput): Promise<WishlistItemResponse>;
  abstract deleteWishlistItem(id: string): Promise<void>;
}
