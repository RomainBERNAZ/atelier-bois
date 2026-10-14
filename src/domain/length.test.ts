import { describe, expect, it } from 'vitest';
import { mm, sumLengths } from './length';

describe('mm', () => {
  it('accepte un entier positif ou nul', () => {
    expect(mm(0)).toBe(0);
    expect(mm(2400)).toBe(2400);
  });

  it.each([-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])('refuse %s', (value) => {
    expect(() => mm(value)).toThrow(RangeError);
  });
});

describe('sumLengths', () => {
  it('additionne des longueurs', () => {
    expect(sumLengths([mm(800), mm(450), mm(450)])).toBe(1700);
  });

  it('renvoie 0 pour une liste vide', () => {
    expect(sumLengths([])).toBe(0);
  });
});
