import { VisionRepositoryImpl } from '../infrastructure/vision.repository.impl';
import type { VisionRepository } from './vision.repository';

export class VisionController {
  constructor(private readonly repository: VisionRepository = new VisionRepositoryImpl()) {}

  get(...args: Parameters<VisionRepository['get']>) {
    return this.repository.get(...args);
  }
  save(...args: Parameters<VisionRepository['save']>) {
    return this.repository.save(...args);
  }
  listWishlist(...args: Parameters<VisionRepository['listWishlist']>) {
    return this.repository.listWishlist(...args);
  }
  createWishlistItem(...args: Parameters<VisionRepository['createWishlistItem']>) {
    return this.repository.createWishlistItem(...args);
  }
  updateWishlistItem(...args: Parameters<VisionRepository['updateWishlistItem']>) {
    return this.repository.updateWishlistItem(...args);
  }
  deleteWishlistItem(...args: Parameters<VisionRepository['deleteWishlistItem']>) {
    return this.repository.deleteWishlistItem(...args);
  }
}
