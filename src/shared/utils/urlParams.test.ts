import { describe, expect, it } from 'vitest';
import {
  encodeRoot,
  parseEnum,
  parseFlag,
  parseInteger,
  parseList,
  parseRoot,
  withoutDefaults,
} from './urlParams';

describe('parseRoot', () => {
  it('round-trips every root', () => {
    for (let root = 0; root < 12; root++) {
      expect(parseRoot(encodeRoot(root))).toBe(root);
    }
  });

  it('accepts sharps written several ways', () => {
    expect(parseRoot('F#')).toBe(6);
    expect(parseRoot('Fs')).toBe(6);
    expect(parseRoot('F♯')).toBe(6);
  });

  it('accepts flats as their enharmonic', () => {
    expect(parseRoot('Db')).toBe(1);
    expect(parseRoot('B♭')).toBe(10);
    expect(parseRoot('Cb')).toBe(11);
  });

  it('ignores case and surrounding spaces', () => {
    expect(parseRoot(' g ')).toBe(7);
    expect(parseRoot('bb')).toBe(10);
  });

  it('rejects anything else', () => {
    expect(parseRoot(null)).toBeUndefined();
    expect(parseRoot('')).toBeUndefined();
    expect(parseRoot('H')).toBeUndefined();
    expect(parseRoot('C##')).toBeUndefined();
    expect(parseRoot('7')).toBeUndefined();
  });
});

describe('parseEnum', () => {
  it('matches strings and numbers by their text form', () => {
    expect(parseEnum('minor', ['major', 'minor'] as const)).toBe('minor');
    expect(parseEnum('2', [0, 1, 2] as const)).toBe(2);
  });

  it('rejects unknown values', () => {
    expect(parseEnum('Minor', ['major', 'minor'] as const)).toBeUndefined();
    expect(parseEnum('3', [0, 1, 2] as const)).toBeUndefined();
    expect(parseEnum(null, ['major'] as const)).toBeUndefined();
  });
});

describe('parseList', () => {
  const parseInversion = (item: string) => parseEnum(item, [0, 1, 2] as const);

  it('reads comma-separated entries in order', () => {
    expect(parseList('2,0', parseInversion)).toEqual([2, 0]);
  });

  it('drops duplicates and unknown entries', () => {
    expect(parseList('1,x,1, 2', parseInversion)).toEqual([1, 2]);
  });

  it('is undefined when nothing is left', () => {
    expect(parseList('x,y', parseInversion)).toBeUndefined();
    expect(parseList('', parseInversion)).toBeUndefined();
    expect(parseList(null, parseInversion)).toBeUndefined();
  });
});

describe('parseFlag', () => {
  it('reads 1 and 0 only', () => {
    expect(parseFlag('1')).toBe(true);
    expect(parseFlag('0')).toBe(false);
    expect(parseFlag('true')).toBeUndefined();
    expect(parseFlag(null)).toBeUndefined();
  });
});

describe('parseInteger', () => {
  it('reads whole numbers', () => {
    expect(parseInteger('80', 40, 240)).toBe(80);
  });

  it('clamps to the range', () => {
    expect(parseInteger('10', 40, 240)).toBe(40);
    expect(parseInteger('999', 40, 240)).toBe(240);
    expect(parseInteger('-5', 0, 21)).toBe(0);
  });

  it('rejects anything that is not a whole number', () => {
    expect(parseInteger('8.5', 0, 21)).toBeUndefined();
    expect(parseInteger('1e3', 0, 21)).toBeUndefined();
    expect(parseInteger('', 0, 21)).toBeUndefined();
    expect(parseInteger(null, 0, 21)).toBeUndefined();
  });
});

describe('withoutDefaults', () => {
  it('keeps only params that differ from the defaults', () => {
    const params = new URLSearchParams({ key: 'C', q: 'minor', notes: '1' });
    const defaults = new URLSearchParams({ key: 'C', q: 'major', notes: '0' });
    expect(withoutDefaults(params, defaults).toString()).toBe('q=minor&notes=1');
  });
});
