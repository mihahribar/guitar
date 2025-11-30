/**
 * Safe localStorage operations with retry logic and error handling
 *
 * Provides a robust wrapper around localStorage operations with automatic
 * retry logic, graceful degradation, and comprehensive error handling.
 */

import type { StorageError, Result } from '../types/errors';
import { createStorageError } from '../types/errors';
import { errorLogger } from './errorLogger';

/**
 * Configuration for safe storage operations
 */
interface SafeStorageConfig {
  /** Maximum number of retry attempts */
  maxRetries: number;
  /** Delay between retries in milliseconds */
  retryDelay: number;
  /** Whether to use exponential backoff for retries */
  exponentialBackoff: boolean;
  /** Whether to log errors */
  enableLogging: boolean;
}

/**
 * Default configuration for safe storage
 */
const DEFAULT_CONFIG: SafeStorageConfig = {
  maxRetries: 3,
  retryDelay: 100,
  exponentialBackoff: true,
  enableLogging: true,
};

/**
 * Safe storage wrapper class
 */
export class SafeStorage {
  private config: SafeStorageConfig;
  private fallbackStorage: Map<string, string> = new Map();
  private isStorageAvailable: boolean = true;

  constructor(config: Partial<SafeStorageConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.checkStorageAvailability();
  }

  /**
   * Safely get an item from localStorage with retry logic
   * @param key - Storage key
   * @returns Result with data or error
   */
  public async getItem(key: string): Promise<Result<string | null, StorageError>> {
    return this.retryOperation(() => this.performGetItem(key), 'read', key);
  }

  /**
   * Safely set an item in localStorage with retry logic
   * @param key - Storage key
   * @param value - Value to store
   * @returns Result indicating success or failure
   */
  public async setItem(key: string, value: string): Promise<Result<void, StorageError>> {
    return this.retryOperation(() => this.performSetItem(key, value), 'write', key);
  }

  /**
   * Safely remove an item from localStorage with retry logic
   * @param key - Storage key
   * @returns Result indicating success or failure
   */
  public async removeItem(key: string): Promise<Result<void, StorageError>> {
    return this.retryOperation(() => this.performRemoveItem(key), 'delete', key);
  }

  /**
   * Safely clear all localStorage with retry logic
   * @returns Result indicating success or failure
   */
  public async clear(): Promise<Result<void, StorageError>> {
    return this.retryOperation(() => this.performClear(), 'clear');
  }

  /**
   * Get an item with JSON parsing and type validation
   * @param key - Storage key
   * @param validator - Function to validate parsed data
   * @returns Result with typed data or error
   */
  public async getJSON<T>(
    key: string,
    validator?: (data: unknown) => data is T
  ): Promise<Result<T | null, StorageError>> {
    const getResult = await this.getItem(key);

    if (!getResult.success) {
      return getResult;
    }

    if (getResult.data === null) {
      return { success: true, data: null };
    }

    try {
      const parsed = JSON.parse(getResult.data);

      if (validator && !validator(parsed)) {
        const error = createStorageError(
          'read',
          'localStorage',
          key,
          new Error('Data validation failed after JSON parsing')
        );
        error.context = { parsedData: parsed };

        if (this.config.enableLogging) {
          errorLogger.logError(error, 'medium');
        }

        return { success: false, error };
      }

      return { success: true, data: parsed };
    } catch (parseError) {
      const error = createStorageError(
        'read',
        'localStorage',
        key,
        parseError instanceof Error ? parseError : new Error('JSON parse failed')
      );

      if (this.config.enableLogging) {
        errorLogger.logError(error, 'medium');
      }

      return { success: false, error };
    }
  }

  /**
   * Set an item with JSON serialization
   * @param key - Storage key
   * @param data - Data to serialize and store
   * @returns Result indicating success or failure
   */
  public async setJSON<T>(key: string, data: T): Promise<Result<void, StorageError>> {
    try {
      const serialized = JSON.stringify(data);
      return await this.setItem(key, serialized);
    } catch (serializeError) {
      const error = createStorageError(
        'write',
        'localStorage',
        key,
        serializeError instanceof Error ? serializeError : new Error('JSON stringify failed')
      );

      if (this.config.enableLogging) {
        errorLogger.logError(error, 'medium');
      }

      return { success: false, error };
    }
  }

  /**
   * Check if localStorage is available and working
   */
  private checkStorageAvailability(): void {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      this.isStorageAvailable = true;
    } catch {
      this.isStorageAvailable = false;
      console.warn('localStorage is not available, falling back to in-memory storage');
    }
  }

  /**
   * Perform the actual get operation
   */
  private performGetItem(key: string): string | null {
    if (!this.isStorageAvailable) {
      return this.fallbackStorage.get(key) || null;
    }

    try {
      return localStorage.getItem(key);
    } catch {
      // If localStorage fails, try fallback
      return this.fallbackStorage.get(key) || null;
    }
  }

  /**
   * Perform the actual set operation
   */
  private performSetItem(key: string, value: string): void {
    if (!this.isStorageAvailable) {
      this.fallbackStorage.set(key, value);
      return;
    }

    try {
      localStorage.setItem(key, value);
      // Also store in fallback for redundancy
      this.fallbackStorage.set(key, value);
    } catch (storageError) {
      // If localStorage fails, use fallback
      this.fallbackStorage.set(key, value);
      throw storageError; // Re-throw to trigger retry logic
    }
  }

  /**
   * Perform the actual remove operation
   */
  private performRemoveItem(key: string): void {
    if (!this.isStorageAvailable) {
      this.fallbackStorage.delete(key);
      return;
    }

    try {
      localStorage.removeItem(key);
      this.fallbackStorage.delete(key);
    } catch (storageError) {
      this.fallbackStorage.delete(key);
      throw storageError;
    }
  }

  /**
   * Perform the actual clear operation
   */
  private performClear(): void {
    if (!this.isStorageAvailable) {
      this.fallbackStorage.clear();
      return;
    }

    try {
      localStorage.clear();
      this.fallbackStorage.clear();
    } catch (storageError) {
      this.fallbackStorage.clear();
      throw storageError;
    }
  }

  /**
   * Retry operation with exponential backoff
   */
  private async retryOperation<T>(
    operation: () => T,
    operationType: StorageError['operation'],
    key?: string
  ): Promise<Result<T, StorageError>> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const result = operation();
        return { success: true, data: result };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // If this was the last attempt, don't wait
        if (attempt === this.config.maxRetries) {
          break;
        }

        // Calculate delay with optional exponential backoff
        const delay = this.config.exponentialBackoff
          ? this.config.retryDelay * Math.pow(2, attempt)
          : this.config.retryDelay;

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // All retries failed, create error
    const storageError = createStorageError(operationType, 'localStorage', key, lastError!);
    storageError.context = {
      attempts: this.config.maxRetries + 1,
      isStorageAvailable: this.isStorageAvailable,
      fallbackUsed: !this.isStorageAvailable,
    };

    if (this.config.enableLogging) {
      errorLogger.logError(storageError, 'medium');
    }

    return { success: false, error: storageError };
  }
}

/**
 * Default safe storage instance
 */
export const safeStorage = new SafeStorage();

/**
 * Convenience functions for common operations
 */
export const safeGetItem = (key: string) => safeStorage.getItem(key);
export const safeSetItem = (key: string, value: string) => safeStorage.setItem(key, value);
export const safeRemoveItem = (key: string) => safeStorage.removeItem(key);
export const safeClear = () => safeStorage.clear();
export const safeGetJSON = <T>(key: string, validator?: (data: unknown) => data is T) =>
  safeStorage.getJSON<T>(key, validator);
export const safeSetJSON = <T>(key: string, data: T) => safeStorage.setJSON(key, data);

/**
 * Hook for using safe storage in React components
 */
export const useSafeStorage = () => {
  return {
    getItem: safeGetItem,
    setItem: safeSetItem,
    removeItem: safeRemoveItem,
    clear: safeClear,
    getJSON: safeGetJSON,
    setJSON: safeSetJSON,
  };
};
