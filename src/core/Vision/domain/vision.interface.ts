import type { DataResponse } from '@interfaces/api.interface';

export type Vision = {
  id: string;
  title: string;
  description: string;
  targetAge: number;
  targetYear: number;
  style: string;
  createdAt: string;
  updatedAt: string;
};
export type VisionInput = Omit<Vision, 'id' | 'createdAt' | 'updatedAt'>;
export type WishlistItem = { id: string; text: string; checked: boolean; createdAt: string; updatedAt: string };
export type WishlistInput = { text: string };
export type WishlistUpdateInput = Partial<WishlistInput> & { checked?: boolean };
export type VisionResponse = DataResponse<Vision | null>;
export type SavedVisionResponse = DataResponse<Vision>;
export type WishlistResponse = DataResponse<WishlistItem[]>;
export type WishlistItemResponse = DataResponse<WishlistItem>;
