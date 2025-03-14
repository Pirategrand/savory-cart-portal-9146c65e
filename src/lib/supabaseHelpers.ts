
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * A wrapper for Supabase operations with improved error handling and timeout management
 * @param operation - The supabase operation to perform
 * @param errorMessage - The user-friendly error message to display
 * @param timeoutMs - Timeout in milliseconds (default: 5000ms)
 * @returns The result of the operation or null on error
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage: string = 'Operation failed',
  timeoutMs: number = 5000
): Promise<T | null> {
  try {
    // Create a timeout promise that rejects after specified milliseconds
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs);
    });

    // Race between the actual operation and the timeout
    const result = await Promise.race([operation(), timeoutPromise]);
    return result;
  } catch (error: any) {
    console.error(`Supabase operation error: ${errorMessage}`, error);
    
    // Handle specific Supabase errors
    if (error.code === 'PGRST116') {
      toast.error('Authentication error', {
        description: 'Please sign in again to continue'
      });
    } else if (error.message?.includes('timeout')) {
      toast.error('Connection timeout', {
        description: 'The server took too long to respond. Please try again.'
      });
    } else {
      toast.error(errorMessage, {
        description: error.message || 'An unexpected error occurred'
      });
    }
    
    return null;
  }
}

/**
 * Fetch data from Supabase with pagination and error handling
 * @param tableName - The name of the table to fetch from
 * @param options - Query options including filters, sorting, etc.
 * @param page - Page number (starts at 1)
 * @param pageSize - Number of items per page
 * @returns The paginated data or null on error
 */
export async function fetchPaginatedData(
  tableName: 'orders' | 'profiles' | 'reviews' | 'review_votes',
  options: {
    select?: string,
    filters?: Record<string, any>,
    order?: { column: string, ascending: boolean },
  } = {},
  page: number = 1,
  pageSize: number = 10
) {
  const { select = '*', filters = {}, order } = options;
  
  const startRow = (page - 1) * pageSize;
  
  return withErrorHandling(async () => {
    let query = supabase
      .from(tableName)
      .select(select, { count: 'exact' })
      .range(startRow, startRow + pageSize - 1);
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });
    
    // Apply ordering
    if (order) {
      query = query.order(order.column, { ascending: order.ascending });
    }
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      data,
      meta: {
        totalCount: count || 0,
        pageCount: Math.ceil((count || 0) / pageSize),
        currentPage: page,
        pageSize
      }
    };
  }, `Failed to fetch data from ${tableName}`);
}

/**
 * Updates a record in Supabase with error handling
 * @param tableName - The table name
 * @param id - The record ID
 * @param updates - The fields to update
 * @returns The updated record or null on error
 */
export async function updateRecord<T>(
  tableName: 'orders' | 'profiles' | 'reviews' | 'review_votes',
  id: string,
  updates: Record<string, any>
) {
  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
      
    if (error) throw error;
    return data as T;
  }, `Failed to update record in ${tableName}`);
}

/**
 * Inserts a record in Supabase with error handling
 * @param tableName - The table name
 * @param record - The record to insert
 * @returns The inserted record or null on error
 */
export async function insertRecord<T>(
  tableName: 'orders' | 'profiles' | 'reviews' | 'review_votes',
  record: any
) {
  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from(tableName)
      .insert(record)
      .select('*')
      .single();
      
    if (error) throw error;
    return data as T;
  }, `Failed to insert record in ${tableName}`);
}

/**
 * Global cache of data to reduce duplicate fetches
 */
const dataCache: Record<string, {
  data: any,
  timestamp: number,
  ttl: number
}> = {};

/**
 * Fetches data with caching support to reduce Supabase calls
 * @param cacheKey - The key to store the data under
 * @param fetchFn - The function to fetch the data
 * @param ttlMs - Time to live in milliseconds (default: 60 seconds)
 */
export async function fetchWithCache<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  ttlMs: number = 60000
): Promise<T | null> {
  // Check if we have a valid cached response
  const cachedItem = dataCache[cacheKey];
  const now = Date.now();
  
  if (cachedItem && now - cachedItem.timestamp < cachedItem.ttl) {
    console.log(`Using cached data for ${cacheKey}`);
    return cachedItem.data;
  }
  
  // No cache or expired cache, fetch fresh data
  try {
    const data = await fetchFn();
    
    // Cache the result
    dataCache[cacheKey] = {
      data,
      timestamp: now,
      ttl: ttlMs
    };
    
    return data;
  } catch (error) {
    console.error(`Error fetching data for cache key: ${cacheKey}`, error);
    
    // If we have expired cache, return that as fallback
    if (cachedItem) {
      console.log(`Using expired cache as fallback for ${cacheKey}`);
      return cachedItem.data;
    }
    
    return null;
  }
}

/**
 * Clears a specific item from the cache
 * @param cacheKey - The key to clear
 */
export function clearCacheItem(cacheKey: string): void {
  delete dataCache[cacheKey];
}

/**
 * Clears all items from the cache
 */
export function clearCache(): void {
  Object.keys(dataCache).forEach(key => {
    delete dataCache[key];
  });
}

/**
 * Check if the device is currently connected to the internet
 */
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

/**
 * Schedules an operation to be retried when the device comes back online
 * @param operation - The function to call when back online
 */
export function retryWhenOnline(operation: () => void): () => void {
  const handleOnline = () => {
    operation();
    window.removeEventListener('online', handleOnline);
  };
  
  window.addEventListener('online', handleOnline);
  
  // Return a function to cancel the retry
  return () => window.removeEventListener('online', handleOnline);
}
