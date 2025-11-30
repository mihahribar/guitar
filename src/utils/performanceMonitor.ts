import React from 'react';

/**
 * Performance monitoring utilities for tracking application performance
 * and identifying optimization opportunities
 */

// Define MemoryInfo interface for Chrome's performance.memory API
interface MemoryInfo {
  readonly usedJSHeapSize: number;
  readonly totalJSHeapSize: number;
  readonly jsHeapSizeLimit: number;
}

export interface PerformanceMetrics {
  /** Component render time in milliseconds */
  renderTime: number;
  /** Memory usage snapshot */
  memoryUsage?: MemoryInfo;
  /** Timestamp when measurement was taken */
  timestamp: number;
  /** Component or operation name */
  name: string;
  /** Additional context data */
  context?: Record<string, unknown>;
}

export interface RenderMetrics {
  /** Component name */
  component: string;
  /** Render duration in milliseconds */
  duration: number;
  /** Number of re-renders */
  renderCount: number;
  /** Props that caused the render */
  triggerProps?: string[];
}

/**
 * Performance monitoring class for tracking render times and memory usage
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private renderMetrics: Map<string, RenderMetrics> = new Map();
  private readonly maxMetrics = 100; // Limit stored metrics to prevent memory leaks

  private constructor() {
    // Singleton pattern
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Measure performance of a function or operation
   * @param name - Operation name for identification
   * @param operation - Function to measure
   * @param context - Additional context data
   * @returns Result of the operation
   */
  public async measure<T>(
    name: string,
    operation: () => T | Promise<T>,
    context?: Record<string, unknown>
  ): Promise<T> {
    const startTime = performance.now();
    const startMemory = this.getMemoryInfo();

    try {
      const result = await operation();
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      this.recordMetric({
        name,
        renderTime,
        timestamp: Date.now(),
        memoryUsage: startMemory,
        context,
      });

      return result;
    } catch (error) {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      this.recordMetric({
        name: `${name} (failed)`,
        renderTime,
        timestamp: Date.now(),
        memoryUsage: startMemory,
        context: { ...context, error: error instanceof Error ? error.message : String(error) },
      });

      throw error;
    }
  }

  /**
   * Start measuring render time for a component
   * @param componentName - Name of the component being rendered
   * @returns Function to call when render is complete
   */
  public startRender(componentName: string): () => void {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.recordRender(componentName, duration);
    };
  }

  /**
   * Record a completed render for a component
   * @param componentName - Name of the component
   * @param duration - Render duration in milliseconds
   * @param triggerProps - Props that caused the render
   */
  public recordRender(componentName: string, duration: number, triggerProps?: string[]): void {
    const existing = this.renderMetrics.get(componentName);

    if (existing) {
      existing.duration = (existing.duration + duration) / 2; // Moving average
      existing.renderCount++;
      if (triggerProps) {
        existing.triggerProps = triggerProps;
      }
    } else {
      this.renderMetrics.set(componentName, {
        component: componentName,
        duration,
        renderCount: 1,
        triggerProps,
      });
    }
  }

  /**
   * Record a performance metric
   * @param metric - Performance metric to record
   */
  private recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);

    // Limit stored metrics to prevent memory leaks
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log significant performance issues
    if (metric.renderTime > 100) {
      console.warn(
        `Slow operation detected: ${metric.name} took ${metric.renderTime.toFixed(2)}ms`
      );
    }
  }

  /**
   * Get memory information if available
   * @returns Memory info or undefined if not supported
   */
  private getMemoryInfo(): MemoryInfo | undefined {
    if ('memory' in performance) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (performance as any).memory;
    }
    return undefined;
  }

  /**
   * Get all recorded performance metrics
   * @returns Array of performance metrics
   */
  public getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Get render metrics for all components
   * @returns Map of component render metrics
   */
  public getRenderMetrics(): Map<string, RenderMetrics> {
    return new Map(this.renderMetrics);
  }

  /**
   * Get performance summary with key insights
   * @returns Performance summary object
   */
  public getSummary(): {
    totalMeasurements: number;
    averageRenderTime: number;
    slowestOperations: PerformanceMetrics[];
    renderSummary: RenderMetrics[];
    memoryTrend?: 'increasing' | 'stable' | 'decreasing';
  } {
    const totalMeasurements = this.metrics.length;
    const averageRenderTime =
      totalMeasurements > 0
        ? this.metrics.reduce((sum, m) => sum + m.renderTime, 0) / totalMeasurements
        : 0;

    const slowestOperations = [...this.metrics]
      .sort((a, b) => b.renderTime - a.renderTime)
      .slice(0, 5);

    const renderSummary = Array.from(this.renderMetrics.values()).sort(
      (a, b) => b.duration - a.duration
    );

    const memoryTrend = this.calculateMemoryTrend();

    return {
      totalMeasurements,
      averageRenderTime,
      slowestOperations,
      renderSummary,
      memoryTrend,
    };
  }

  /**
   * Calculate memory usage trend
   * @returns Memory trend or undefined if not enough data
   */
  private calculateMemoryTrend(): 'increasing' | 'stable' | 'decreasing' | undefined {
    const memoryMetrics = this.metrics.filter((m) => m.memoryUsage).slice(-10); // Look at last 10 measurements

    if (memoryMetrics.length < 3) {
      return undefined;
    }

    const first = memoryMetrics[0].memoryUsage!.usedJSHeapSize;
    const last = memoryMetrics[memoryMetrics.length - 1].memoryUsage!.usedJSHeapSize;
    const difference = last - first;
    const threshold = first * 0.1; // 10% threshold

    if (difference > threshold) {
      return 'increasing';
    } else if (difference < -threshold) {
      return 'decreasing';
    } else {
      return 'stable';
    }
  }

  /**
   * Clear all stored metrics
   */
  public clear(): void {
    this.metrics = [];
    this.renderMetrics.clear();
  }

  /**
   * Export metrics as JSON for analysis
   * @returns JSON string of all metrics
   */
  public exportMetrics(): string {
    return JSON.stringify(
      {
        metrics: this.metrics,
        renderMetrics: Array.from(this.renderMetrics.entries()),
        summary: this.getSummary(),
        timestamp: Date.now(),
      },
      null,
      2
    );
  }
}

/**
 * React hook for performance monitoring in components
 * @param componentName - Name of the component to monitor
 * @returns Performance monitoring utilities
 */
export function usePerformanceMonitor(componentName: string) {
  const monitor = PerformanceMonitor.getInstance();

  const startRender = () => monitor.startRender(componentName);

  const measureAsync = async <T>(
    operationName: string,
    operation: () => T | Promise<T>,
    context?: Record<string, unknown>
  ): Promise<T> => {
    return monitor.measure(`${componentName}.${operationName}`, operation, context);
  };

  return {
    startRender,
    measureAsync,
    getMetrics: () => monitor.getMetrics(),
    getSummary: () => monitor.getSummary(),
  };
}

/**
 * Higher-order component for automatic performance monitoring
 * @param WrappedComponent - Component to wrap
 * @param displayName - Optional display name for monitoring
 * @returns Wrapped component with performance monitoring
 */
export function withPerformanceMonitoring<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  displayName?: string
): React.ComponentType<P> {
  const componentName =
    displayName || WrappedComponent.displayName || WrappedComponent.name || 'Unknown';

  return function PerformanceMonitoredComponent(props: P) {
    const monitor = PerformanceMonitor.getInstance();
    const endRender = monitor.startRender(componentName);

    React.useEffect(() => {
      endRender();
    });

    return React.createElement(WrappedComponent, props);
  };
}

// Export singleton instance for direct access
export const performanceMonitor = PerformanceMonitor.getInstance();
