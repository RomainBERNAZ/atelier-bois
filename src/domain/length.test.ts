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

  it('accepte le plus grand entier sûr', () => {
    expect(mm(Number.MAX_SAFE_INTEGER)).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('refuse un entier au-delà de la limite sûre', () => {
    expect(() => mm(Number.MAX_SAFE_INTEGER + 1)).toThrow(RangeError);
  });

  it.each([Number.NEGATIVE_INFINITY, Number.EPSILON])('refuse aussi %s', (value) => {
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

  it('accepte une somme égale au plus grand entier sûr', () => {
    expect(sumLengths([mm(Number.MAX_SAFE_INTEGER - 1), mm(1)])).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('refuse une somme au-delà de la limite sûre', () => {
    expect(() => sumLengths([mm(Number.MAX_SAFE_INTEGER), mm(1)])).toThrow(RangeError);
  });

  it('préserve le contenu et l’ordre du tableau fourni', () => {
    const lengths = [mm(800), mm(0), mm(450), mm(450)];
    const originalLengths = [...lengths];

    expect(sumLengths(lengths)).toBe(1700);
    expect(lengths).toEqual(originalLengths);
  });

  it('accepte un tableau gelé en lecture seule', () => {
    const lengths = Object.freeze([mm(800), mm(450), mm(450)]);

    expect(sumLengths(lengths)).toBe(1700);
  });
});
