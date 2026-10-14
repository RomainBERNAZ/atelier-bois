/**
 * Toutes les longueurs du projet sont des entiers en millimètres (voir ADR 0003).
 * Le type « brandé » empêche de mélanger une longueur avec un nombre quelconque.
 */
export type Millimetres = number & { readonly __unit: 'mm' };

export function mm(value: number): Millimetres {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`Une longueur est un entier positif ou nul en mm, reçu : ${String(value)}`);
  }
  return value as Millimetres;
}

export function sumLengths(lengths: readonly Millimetres[]): Millimetres {
  return mm(lengths.reduce((total, length) => total + length, 0));
}
