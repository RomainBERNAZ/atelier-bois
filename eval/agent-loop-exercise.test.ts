import { describe, expect, it, vi } from 'vitest';
import { createScriptedModel, runAgentExercise } from './agent-loop-exercise';

describe('exercice isolé : boucle d’agent simulée', () => {
  it('transmet les résultats des deux outils au modèle avant la réponse finale', () => {
    const model = vi.fn(createScriptedModel([
      { type: 'tool_call', name: 'validate_length', arguments: { value: 400 } },
      { type: 'tool_call', name: 'sum_lengths', arguments: { lengths: [400, 600] } },
      { type: 'final', message: 'Les résultats des outils sont disponibles.' },
    ]));

    const result = runAgentExercise('Valide puis additionne les longueurs.', model, 3);

    expect(result.message).toBe('Les résultats des outils sont disponibles.');
    expect(model).toHaveBeenCalledTimes(3);
    expect(model.mock.calls[0]?.[0]).toEqual([
      { role: 'user', content: 'Valide puis additionne les longueurs.' },
    ]);
    expect(model.mock.calls[1]?.[0]).toHaveLength(3);
    expect(model.mock.calls[1]?.[0].at(-1)).toEqual({
      role: 'tool', name: 'validate_length', result: 400,
    });
    expect(model.mock.calls[2]?.[0]).toHaveLength(5);
    expect(model.mock.calls[2]?.[0].at(-1)).toEqual({
      role: 'tool', name: 'sum_lengths', result: 1000,
    });
    expect(result.messages).toHaveLength(6);
    expect(result.messages.at(-1)).toEqual({
      role: 'assistant', reply: { type: 'final', message: result.message },
    });
  });

  it('accepte une réponse finale immédiate au dernier appel autorisé', () => {
    const model = createScriptedModel([{ type: 'final', message: 'Aucun calcul demandé.' }]);
    expect(runAgentExercise('Bonjour.', model, 1).message).toBe('Aucun calcul demandé.');
  });

  it('calcule une somme vide dans l’outil', () => {
    const model = createScriptedModel([
      { type: 'tool_call', name: 'sum_lengths', arguments: { lengths: [] } },
      { type: 'final', message: 'Calcul terminé.' },
    ]);
    expect(runAgentExercise('Additionne la liste vide.', model).messages[2]).toEqual({
      role: 'tool', name: 'sum_lengths', result: 0,
    });
  });

  it.each([
    { name: 'validate_length', arguments: { value: '400' } },
    { name: 'validate_length', arguments: {} },
    { name: 'sum_lengths', arguments: { lengths: [400, '600'] } },
    { name: 'sum_lengths', arguments: { lengths: '400' } },
    { name: 'sum_lengths', arguments: null },
    { name: 'sum_lengths', arguments: [] },
  ])('refuse les arguments invalides : $name $arguments', (call) => {
    const model = vi.fn(createScriptedModel([{ type: 'tool_call', ...call }]));
    expect(() => runAgentExercise('Calcule.', model)).toThrow(TypeError);
    expect(model).toHaveBeenCalledTimes(1);
  });

  it.each([-1, 0.5, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1])(
    'refuse une longueur invalide : %s',
    (value) => {
      const model = createScriptedModel([
        { type: 'tool_call', name: 'validate_length', arguments: { value } },
      ]);
      expect(() => runAgentExercise('Valide.', model)).toThrow(RangeError);
    },
  );

  it('refuse une somme dépassant les entiers sûrs', () => {
    const model = createScriptedModel([
      { type: 'tool_call', name: 'sum_lengths', arguments: { lengths: [Number.MAX_SAFE_INTEGER, 1] } },
    ]);
    expect(() => runAgentExercise('Additionne.', model)).toThrow(RangeError);
  });

  it('refuse un outil inconnu sans l’exécuter ni rappeler le modèle', () => {
    const model = vi.fn(createScriptedModel([
      { type: 'tool_call', name: 'unknown_tool', arguments: {} },
    ]));
    expect(() => runAgentExercise('Calcule.', model)).toThrow('Outil inconnu');
    expect(model).toHaveBeenCalledTimes(1);
  });

  it.each([null, {}, { type: 'final', message: 12 }, { type: 'tool_call', name: 'sum_lengths' }])(
    'refuse une réponse de modèle mal formée : %j',
    (reply) => {
      expect(() => runAgentExercise('Calcule.', createScriptedModel([reply]))).toThrow(TypeError);
    },
  );

  it('signale un scénario épuisé sans inventer de réponse', () => {
    expect(() => runAgentExercise('Bonjour.', createScriptedModel([]))).toThrow(TypeError);
  });

  it('arrête une boucle sans réponse finale après le nombre exact d’appels autorisés', () => {
    const model = vi.fn(() => ({
      type: 'tool_call', name: 'validate_length', arguments: { value: 0 },
    }));
    expect(() => runAgentExercise('Continue.', model, 2)).toThrow('Limite d’appels');
    expect(model).toHaveBeenCalledTimes(2);
  });

  it.each([0, -1, 1.5, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1])(
    'refuse une limite invalide avant d’appeler le modèle : %s',
    (limit) => {
      const model = vi.fn(createScriptedModel([]));
      expect(() => runAgentExercise('Bonjour.', model, limit)).toThrow(RangeError);
      expect(model).not.toHaveBeenCalled();
    },
  );

  it('refuse une demande vide avant d’appeler le modèle', () => {
    const model = vi.fn(createScriptedModel([]));
    expect(() => runAgentExercise('   ', model)).toThrow(TypeError);
    expect(model).not.toHaveBeenCalled();
  });
});