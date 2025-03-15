
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
  // First check if we're online
  if (!isOnline()) {
    console.error('Operation cancelled - device is offline');
    toast.error('You are offline', {
      description: 'Please check your internet connection and try again'
    });
    return null;
  }

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
    } else if (error.message?.includes('fetch') || error.message?.includes('network') || !navigator.onLine) {
      toast.error('Network error', {
        description: 'Please check your internet connection and try again.'
      });
    } else if (error.code === '23505') {
      toast.error('Duplicate entry', {
        description: 'This item already exists.'
      });
    } else if (error.code?.startsWith('23')) {
      toast.error('Data validation error', {
        description: error.message || 'Please check your input and try again.'
      });
    } else if (error.code?.startsWith('42')) {
      toast.error('Database error', {
        description: 'There was an issue with the database. Please try again later.'
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
 * Simplified type handling to avoid TypeScript excessively deep instantiation
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
    // Creating a basic query - using any type to avoid deep instantiation issues
    // @ts-ignore - Ignoring type checking for this method to avoid infinite instantiation
    let query = supabase
      .from(tableName)
      .select(select, { count: 'exact' })
      .range(startRow, startRow + pageSize - 1);
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // @ts-ignore - Using type assertion to avoid deep type checking
        query = query.eq(key, value);
      }
    });
    
    // Apply ordering
    if (order) {
      // @ts-ignore - Using type assertion to avoid deep type checking
      query = query.order(order.column, { ascending: order.ascending });
    }
    
    // Execute query and handle the response
    const response = await query;
    
    if (response.error) throw response.error;
    
    // Use explicit type handling to avoid deep instantiation
    const count = typeof response.count === 'number' ? response.count : 0;
    
    return {
      data: response.data || [],
      meta: {
        totalCount: count,
        pageCount: Math.ceil(count / pageSize),
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
 * Enhanced function to check connection with more reliable indicators
 */
export function hasNetworkConnection(): boolean {
  // Basic online check
  const isNavigatorOnline = typeof navigator !== 'undefined' && navigator.onLine;
  
  // Add fallback checks if needed later
  return isNavigatorOnline;
}

/**
 * Schedules an operation to be retried when the device comes back online
 * with improved status monitoring
 */
export function retryWhenOnline(operation: () => void): () => void {
  let retryCount = 0;
  const MAX_RETRIES = 3;
  
  const handleOnline = () => {
    retryCount++;
    if (retryCount <= MAX_RETRIES) {
      console.log(`Network is back online. Retry attempt ${retryCount}/${MAX_RETRIES}`);
      try {
        operation();
        window.removeEventListener('online', handleOnline);
        toast.success('You are back online', {
          description: 'The operation has been resumed.'
        });
      } catch (error) {
        console.error('Error during retry operation:', error);
        if (retryCount >= MAX_RETRIES) {
          toast.error('Failed to complete operation', {
            description: 'Please try again manually.'
          });
          window.removeEventListener('online', handleOnline);
        }
      }
    } else {
      window.removeEventListener('online', handleOnline);
    }
  };
  
  if (!isOnline()) {
    toast.error('You are offline', {
      description: 'Operation will resume when you are back online.'
    });
  }
  
  window.addEventListener('online', handleOnline);
  
  // Return a function to cancel the retry
  return () => window.removeEventListener('online', handleOnline);
}
