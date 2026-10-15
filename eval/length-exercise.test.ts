import { describe, expect, it } from 'vitest';
import { mm } from '../src/domain/length';
import { remainingStockLength, requiredStockLength } from './length-exercise';

describe('exercice isolé : longueurs nécessaires', () => {
  it('additionne les pièces sans trait de scie', () => {
    expect(requiredStockLength([mm(400), mm(600)], mm(0))).toBe(1000);
  });

  it('ne consomme rien pour une liste vide', () => {
    expect(requiredStockLength([], mm(5))).toBe(0);
  });

  it('refuse une somme au-delà des entiers sûrs', () => {
    expect(() => requiredStockLength([mm(Number.MAX_SAFE_INTEGER), mm(1)], mm(0))).toThrow(
      RangeError,
    );
  });

  it.each([
    { lengths: [400], expected: 400 },
    { lengths: [400, 600], expected: 1005 },
    { lengths: [400, 600, 200], expected: 1210 },
  ])('réserve uniquement les séparations entre les pièces $lengths', ({ lengths, expected }) => {
    expect(requiredStockLength(lengths.map(mm), mm(5))).toBe(expected);
  });

  it('refuse un dépassement dû aux séparations entre pièces', () => {
    expect(() => requiredStockLength([mm(0), mm(0), mm(0)], mm(Number.MAX_SAFE_INTEGER))).toThrow(
      RangeError,
    );
  });
});

describe('exercice isolé : longueur restante', () => {
  it('calcule le reste sans trait de scie', () => {
    expect(remainingStockLength(mm(1200), [mm(400), mm(600)], mm(0))).toBe(200);
  });

  it('renvoie zéro lorsque les pièces occupent toute la longueur', () => {
    expect(remainingStockLength(mm(1000), [mm(400), mm(600)], mm(0))).toBe(0);
  });

  it('refuse une longueur disponible insuffisante', () => {
    expect(() => remainingStockLength(mm(900), [mm(400), mm(600)], mm(0))).toThrow(
      RangeError,
    );
  });

  it('calcule le reste théorique hors coupe finale en comptant les séparations', () => {
    expect(remainingStockLength(mm(1200), [mm(400), mm(600)], mm(5))).toBe(195);
  });
});