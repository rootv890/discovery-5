import { asc, desc } from 'drizzle-orm';
import { ApiMetadata, ApiResponse } from '../type';

export const getPaginationParams = (
  query: any, // eg : req.query
  validSortFields: string[] = [ 'createdAt', 'name' ] // default sort fields
) => {
  const sortBy = validSortFields.includes( query.sortBy as string )
    ? query.sortBy
    : 'createdAt'; // default sort field
  const order = query.order === 'asc' ? 'asc' : 'desc'; // default order
  const page = Number( query.page ) || 1; // default page
  const limit = Number( query.limit ) || 10; // default limit
  const offset = ( page - 1 ) * limit; // default offset
  return { sortBy, order, page, limit, offset };
};

// Returns the drizzle order function based on the order string
export const getSortingDirection = ( order: string ) => {
  return order === 'asc' ? asc : desc;
};

// Constructs pagination metadata for the API responses
export const getPaginationMetadata = (
  totalItems: number,
  page: number,
  limit: number,
  sortBy: string,
  order: string
) => {
  const totalPages = Math.ceil( totalItems / limit );
  return {
    total: totalItems,
    page,
    limit,
    totalPages,
    nextPage: page + 1 > totalPages ? null : page + 1,
    previousPage: page - 1 < 1 ? null : page - 1,
    hasNextPage: page + 1 <= totalPages,
    hasPreviousPage: page - 1 >= 1,
    isFirstPage: page === 1,
    isLastPage: page === totalPages,
    sortBy,
    order,
    timestamp: Date.now(),
  };
};

// Create a reusable error response function
export const createApiErrorResponse = ( error: unknown ) => {
  return {
    success: false,
    message: 'Internal Server Error',
    data: [],
    error: {
      code: 500,
      message: ( error as Error ).message,
      details: ( error as Error ).stack,
    },
  };
};
