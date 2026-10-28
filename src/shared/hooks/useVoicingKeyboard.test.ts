import { describe, it, expect } from 'vitest';
import { inversionFromKey } from './useVoicingKeyboard';

describe('inversionFromKey', () => {
  it('maps the number row to inversions, up to the inversion count', () => {
    expect(inversionFromKey({ code: 'Digit1', key: '1' }, 3)).toBe(0);
    expect(inversionFromKey({ code: 'Digit4', key: '4' }, 4)).toBe(3);
    expect(inversionFromKey({ code: 'Digit4', key: '4' }, 3)).toBeUndefined();
    expect(inversionFromKey({ code: 'Digit0', key: '0' }, 3)).toBeUndefined();
  });

  it('reads the physical key when Shift changes the character', () => {
    expect(inversionFromKey({ code: 'Digit2', key: '@' }, 3)).toBe(1);
  });

  it('falls back to the character for keys outside the number row', () => {
    expect(inversionFromKey({ code: 'Numpad3', key: '3' }, 3)).toBe(2);
    expect(inversionFromKey({ code: 'KeyN', key: 'n' }, 3)).toBeUndefined();
  });
});
