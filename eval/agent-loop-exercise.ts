import { mm, sumLengths } from '../src/domain/length';
import type { Millimetres } from '../src/domain/length';

type ToolCall = { type: 'tool_call'; name: string; arguments: unknown };
type FinalReply = { type: 'final'; message: string };
type ModelReply = ToolCall | FinalReply;

export type ExerciseMessage =
  | { role: 'user'; content: string }
  | { role: 'assistant'; reply: ModelReply }
  | { role: 'tool'; name: string; result: Millimetres };

export type ExerciseModel = (messages: readonly ExerciseMessage[]) => unknown;

function parseReply(value: unknown): ModelReply {
  if (typeof value === 'object' && value !== null && 'type' in value) {
    if (value.type === 'final' && 'message' in value && typeof value.message === 'string') {
      return { type: 'final', message: value.message };
    }
    if (
      value.type === 'tool_call' &&
      'name' in value && typeof value.name === 'string' &&
      'arguments' in value
    ) {
      return { type: 'tool_call', name: value.name, arguments: value.arguments };
    }
  }
  throw new TypeError('Réponse du modèle simulé invalide.');
}

function parseLength(value: unknown): Millimetres {
  if (typeof value !== 'number') {
    throw new TypeError('Une longueur doit être un nombre entier en millimètres.');
  }
  return mm(value);
}

function executeTool(call: ToolCall): Millimetres {
  if (call.name !== 'validate_length' && call.name !== 'sum_lengths') {
    throw new RangeError('Outil inconnu dans cet exercice.');
  }
  const args = call.arguments;
  if (typeof args !== 'object' || args === null || Array.isArray(args)) {
    throw new TypeError('Arguments de l’outil invalides.');
  }
  if (call.name === 'validate_length' && 'value' in args) {
    return parseLength(args.value);
  }
  if (call.name === 'sum_lengths' && 'lengths' in args && Array.isArray(args.lengths)) {
    const lengths: readonly unknown[] = args.lengths;
    return sumLengths(lengths.map(parseLength));
  }
  throw new TypeError('Arguments de l’outil invalides.');
}

export function createScriptedModel(replies: readonly unknown[]): ExerciseModel {
  return (messages) => {
    const replyIndex = messages.filter((message) => message.role === 'assistant').length;
    return replies[replyIndex];
  };
}

export function runAgentExercise(
  request: string,
  model: ExerciseModel,
  maxModelCalls = 4,
): { message: string; messages: readonly ExerciseMessage[] } {
  if (typeof request !== 'string' || request.trim().length === 0) {
    throw new TypeError('La demande doit être un texte non vide.');
  }
  if (!Number.isSafeInteger(maxModelCalls) || maxModelCalls < 1) {
    throw new RangeError('La limite d’appels doit être un entier strictement positif.');
  }
  const messages: ExerciseMessage[] = [{ role: 'user', content: request }];
  for (let callIndex = 0; callIndex < maxModelCalls; callIndex += 1) {
    const reply = parseReply(model([...messages]));
    messages.push({ role: 'assistant', reply });
    if (reply.type === 'final') {
      return { message: reply.message, messages };
    }
    const result = executeTool(reply);
    messages.push({ role: 'tool', name: reply.name, result });
  }
  throw new RangeError('Limite d’appels au modèle simulé atteinte.');
}