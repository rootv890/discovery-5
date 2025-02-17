export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  metadata?: ApiMetadata;
  error?: ApiError; // Optional error field
}

export interface ApiMetadata {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  nextPage?: number | null;
  previousPage?: number | null;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  isFirstPage?: boolean;
  isLastPage?: boolean;
  sortBy?: string;
  order?: 'asc' | 'desc';
  timestamp?: number; // Useful for debugging
}

export interface ApiError {
  code: number;
  message: string;
  details?: string;
}
