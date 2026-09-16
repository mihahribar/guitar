import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCAGEDSequence } from '../useCAGEDSequence';
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

describe('useCAGEDState - position selection', () => {
  // The C walk across a 21-fret neck: C@0, A@3, G@5, E@8, D@10, C@12, A@15, G@17
  const SEQUENCE_LENGTH = 8;

  it('derives the sequence length from the selected chord', () => {
    const { result } = renderHook(() => useCAGEDSequence('C'));
    expect(result.current).toHaveLength(SEQUENCE_LENGTH);
  });

  it('starts with only the first position selected', () => {
    const { result } = renderHook(() => useCAGEDState());
    expect(result.current.state.selectedPositions).toEqual([0]);
  });

  it('stacks positions and never empties the selection', () => {
    const { result } = renderHook(() => useCAGEDState());

    act(() => result.current.actions.togglePosition(3));
    expect(result.current.state.selectedPositions).toEqual([0, 3]);

    act(() => result.current.actions.togglePosition(0));
    expect(result.current.state.selectedPositions).toEqual([3]);

    // The last remaining position stays put
    act(() => result.current.actions.togglePosition(3));
    expect(result.current.state.selectedPositions).toEqual([3]);
  });

  it('shows a single position on its own', () => {
    const { result } = renderHook(() => useCAGEDState());

    act(() => result.current.actions.togglePosition(2));
    act(() => result.current.actions.togglePosition(4));
    expect(result.current.state.selectedPositions).toEqual([0, 2, 4]);

    act(() => result.current.actions.soloPosition(2));
    expect(result.current.state.selectedPositions).toEqual([2]);
  });

  it('walks the whole selection up and down the neck as a group', () => {
    const { result } = renderHook(() => useCAGEDState());

    act(() => result.current.actions.togglePosition(1));
    expect(result.current.state.selectedPositions).toEqual([0, 1]);

    act(() => result.current.actions.nextPosition());
    expect(result.current.state.selectedPositions).toEqual([1, 2]);

    act(() => result.current.actions.previousPosition());
    expect(result.current.state.selectedPositions).toEqual([0, 1]);
  });

  it('wraps around the end of the sequence', () => {
    const { result } = renderHook(() => useCAGEDState());

    act(() => result.current.actions.previousPosition());
    expect(result.current.state.selectedPositions).toEqual([SEQUENCE_LENGTH - 1]);

    act(() => result.current.actions.nextPosition());
    expect(result.current.state.selectedPositions).toEqual([0]);
  });

  it('keeps the full-neck view when the chord root changes', () => {
    const { result } = renderHook(() => useCAGEDState());

    act(() => result.current.actions.toggleAllPositions());
    act(() => result.current.actions.setChord('G'));
    expect(result.current.state.selectedPositions).toHaveLength(
      renderHook(() => useCAGEDSequence('G')).result.current.length
    );
  });

  it('selects every position and restores the previous selection', () => {
    const { result } = renderHook(() => useCAGEDState());

    act(() => result.current.actions.soloPosition(4));
    act(() => result.current.actions.togglePosition(6));
    expect(result.current.state.selectedPositions).toEqual([4, 6]);

    act(() => result.current.actions.toggleAllPositions());
    expect(result.current.state.selectedPositions).toHaveLength(SEQUENCE_LENGTH);

    act(() => result.current.actions.toggleAllPositions());
    expect(result.current.state.selectedPositions).toEqual([4, 6]);
  });

  it('resets the selection when the chord root changes', () => {
    const { result } = renderHook(() => useCAGEDState());

    act(() => result.current.actions.togglePosition(5));
    act(() => result.current.actions.setChord('G'));
    // The sequence is rebuilt for the new chord, so old indices no longer apply
    expect(result.current.state.selectedPositions).toEqual([0]);
  });

  it('keeps the selection when chord quality changes', () => {
    const { result } = renderHook(() => useCAGEDState());

    act(() => result.current.actions.togglePosition(2));
    act(() => result.current.actions.setChordQuality('minor'));
    expect(result.current.state.selectedPositions).toEqual([0, 2]);
  });
});
