
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * A wrapper for Supabase operations with improved error handling and timeout management
 * @param operation - The supabase operation to perform
 * @param errorMessage - The user-friendly error message to display
 * @param timeoutMs - Timeout in milliseconds (default: 10000ms)
 * @returns The result of the operation or null on error
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage: string = 'Operation failed',
  timeoutMs: number = 10000
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
  tableName: string,
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
      .select(select)
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
    
    const { data, error, count } = await query.count('exact');
    
    if (error) throw error;
    
    return {
      data,
      meta: {
        totalCount: count,
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
export async function updateRecord(
  tableName: string,
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
    return data;
  }, `Failed to update record in ${tableName}`);
}

/**
 * Inserts a record in Supabase with error handling
 * @param tableName - The table name
 * @param record - The record to insert
 * @returns The inserted record or null on error
 */
export async function insertRecord(
  tableName: string,
  record: Record<string, any>
) {
  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from(tableName)
      .insert(record)
      .select('*')
      .single();
      
    if (error) throw error;
    return data;
  }, `Failed to insert record in ${tableName}`);
}
