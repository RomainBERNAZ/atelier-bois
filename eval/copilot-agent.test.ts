import { describe, expect, it } from 'vitest';
import {
  executeSumLengthsTool,
  executeValidateLengthTool,
  isPermittedToolRequest,
  sumLengthValues,
} from '../experiments/copilot-agent.ts';

describe('mini-agent Copilot : outils déterministes', () => {
  it('valide les arguments de longueur en millimètres entiers avant exécution', () => {
    expect(executeValidateLengthTool({ value: 400 })).toBe(400);

    for (const value of [-1, 0.5, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1]) {
      expect(() => executeValidateLengthTool({ value })).toThrow();
    }
    expect(() => executeValidateLengthTool({ value: '400' })).toThrow();
  });

  it('valide les longueurs avant de calculer par le domaine', () => {
    expect(sumLengthValues([400, 600])).toBe(1000);
    expect(executeSumLengthsTool({ lengths: [400, 600] })).toBe(1000);
    expect(executeSumLengthsTool({ lengths: [] })).toBe(0);
    expect(() => executeSumLengthsTool({ lengths: [Number.MAX_SAFE_INTEGER, 1] })).toThrow(RangeError);
    expect(() => executeSumLengthsTool({ lengths: [400, '600'] })).toThrow();
    expect(() => executeSumLengthsTool({ lengths: '400' })).toThrow();
  });

  it('n’autorise que les deux outils de calcul', () => {
    expect(isPermittedToolRequest('custom-tool', 'validate_length')).toBe(true);
    expect(isPermittedToolRequest('custom-tool', 'sum_lengths')).toBe(true);
    expect(isPermittedToolRequest('custom-tool', 'unknown_tool')).toBe(false);
    expect(isPermittedToolRequest('shell', 'validate_length')).toBe(false);
    expect(isPermittedToolRequest('write', undefined)).toBe(false);
  });
});