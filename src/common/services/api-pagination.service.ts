import type { PaginatedResponse } from '@interfaces/api.interface';

const PAGE_LIMIT = 100;

export async function fetchAllPages<T>(
  fetchPage: (page: number, limit: number) => Promise<PaginatedResponse<T>>
): Promise<PaginatedResponse<T>> {
  const firstPage = await fetchPage(1, PAGE_LIMIT);
  if (firstPage.meta.totalPages <= 1) return firstPage;

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.meta.totalPages - 1 }, (_, index) => fetchPage(index + 2, PAGE_LIMIT))
  );

  return {
    data: [firstPage, ...remainingPages].flatMap((page) => page.data),
    meta: { ...firstPage.meta, page: 1, limit: firstPage.meta.totalItems, totalPages: 1 },
  };
}
