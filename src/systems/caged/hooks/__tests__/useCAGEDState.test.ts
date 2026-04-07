import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCAGEDState } from '../useCAGEDState';

describe('useCAGEDState - scale overlay', () => {
  it('should initialize with showScale=false and selectedScale="major"', () => {
    const { result } = renderHook(() => useCAGEDState());
    expect(result.current.state.showScale).toBe(false);
    expect(result.current.state.selectedScale).toBe('major');
  });

  it('should toggle showScale ON and OFF', () => {
    const { result } = renderHook(() => useCAGEDState());

    act(() => result.current.actions.toggleShowScale());
    expect(result.current.state.showScale).toBe(true);

    act(() => result.current.actions.toggleShowScale());
    expect(result.current.state.showScale).toBe(false);
  });

  it('should set scale type', () => {
    const { result } = renderHook(() => useCAGEDState());

    act(() => result.current.actions.setScaleType('dorian'));
    expect(result.current.state.selectedScale).toBe('dorian');

    act(() => result.current.actions.setScaleType('harmonicMinor'));
    expect(result.current.state.selectedScale).toBe('harmonicMinor');
  });

  it('should persist showScale when switching chords', () => {
    const { result } = renderHook(() => useCAGEDState());

    act(() => result.current.actions.toggleShowScale());
    expect(result.current.state.showScale).toBe(true);

    act(() => result.current.actions.setChord('G'));
    expect(result.current.state.showScale).toBe(true);
    expect(result.current.state.selectedScale).toBe('major');
  });

  it('should persist showScale when switching chord quality', () => {
    const { result } = renderHook(() => useCAGEDState());

    act(() => result.current.actions.toggleShowScale());
    act(() => result.current.actions.setScaleType('dorian'));

    act(() => result.current.actions.setChordQuality('minor'));
    expect(result.current.state.showScale).toBe(true);
    // Dorian should NOT auto-switch (only major↔naturalMinor)
    expect(result.current.state.selectedScale).toBe('dorian');
  });

  it('should auto-switch Major→Natural Minor on quality change to minor', () => {
    const { result } = renderHook(() => useCAGEDState());

    // Default scale is 'major'
    expect(result.current.state.selectedScale).toBe('major');

    act(() => result.current.actions.setChordQuality('minor'));
    expect(result.current.state.selectedScale).toBe('naturalMinor');
  });

  it('should auto-switch Natural Minor→Major on quality change to major', () => {
    const { result } = renderHook(() => useCAGEDState());

    // Set to natural minor first
    act(() => result.current.actions.setScaleType('naturalMinor'));
    act(() => result.current.actions.setChordQuality('minor'));
    expect(result.current.state.selectedScale).toBe('naturalMinor');

    act(() => result.current.actions.setChordQuality('major'));
    expect(result.current.state.selectedScale).toBe('major');
  });

  it('should NOT auto-switch non-major/naturalMinor scale types on quality change', () => {
    const { result } = renderHook(() => useCAGEDState());

    act(() => result.current.actions.setScaleType('lydian'));
    act(() => result.current.actions.setChordQuality('minor'));
    expect(result.current.state.selectedScale).toBe('lydian');

    act(() => result.current.actions.setChordQuality('major'));
    expect(result.current.state.selectedScale).toBe('lydian');
  });

  it('should auto-switch even when scale overlay is OFF', () => {
    const { result } = renderHook(() => useCAGEDState());

    // showScale is false by default
    expect(result.current.state.showScale).toBe(false);
    expect(result.current.state.selectedScale).toBe('major');

    act(() => result.current.actions.setChordQuality('minor'));
    expect(result.current.state.selectedScale).toBe('naturalMinor');
  });

  it('should remember selected scale type after toggle OFF and ON', () => {
    const { result } = renderHook(() => useCAGEDState());

    act(() => result.current.actions.setScaleType('dorian'));
    act(() => result.current.actions.toggleShowScale()); // ON
    act(() => result.current.actions.toggleShowScale()); // OFF
    act(() => result.current.actions.toggleShowScale()); // ON again

    expect(result.current.state.selectedScale).toBe('dorian');
    expect(result.current.state.showScale).toBe(true);
  });
});
