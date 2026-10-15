import { mm, sumLengths } from '../src/domain/length';
import type { Millimetres } from '../src/domain/length';

export function requiredStockLength(
  lengths: readonly Millimetres[],
  sawKerf: Millimetres,
): Millimetres {
  const separationCount = Math.max(0, lengths.length - 1);
  return mm(sumLengths(lengths) + separationCount * sawKerf);
}

export function remainingStockLength(
  stockLength: Millimetres,
  lengths: readonly Millimetres[],
  sawKerf: Millimetres,
): Millimetres {
  return mm(stockLength - requiredStockLength(lengths, sawKerf));
}