import { CopilotClient, defineTool, ToolSet } from '@github/copilot-sdk';
import type { PermissionRequest, PermissionRequestResult } from '@github/copilot-sdk';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { z } from 'zod';
import { mm, sumLengths as calculateSumLengths } from '../src/domain/length.ts';
import type { Millimetres } from '../src/domain/length.ts';

const millimetresSchema = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);

export const validateLengthArgumentsSchema = z.object({ value: millimetresSchema });
export const sumLengthsArgumentsSchema = z.object({ lengths: z.array(millimetresSchema) });

const permittedToolNames = new Set(['validate_length', 'sum_lengths']);

export function validateLength(value: number): Millimetres {
  return mm(value);
}

export function sumLengthValues(values: readonly number[]): Millimetres {
  return calculateSumLengths(values.map(mm));
}

export function executeValidateLengthTool(input: unknown): Millimetres {
  const { value } = validateLengthArgumentsSchema.parse(input);
  return validateLength(value);
}

export function executeSumLengthsTool(input: unknown): Millimetres {
  const { lengths } = sumLengthsArgumentsSchema.parse(input);
  return sumLengthValues(lengths);
}

export const validateLengthTool = defineTool('validate_length', {
  description: 'Valide une longueur entière non négative en millimètres.',
  parameters: validateLengthArgumentsSchema,
  handler: (toolArguments) => {
    const result = executeValidateLengthTool(toolArguments);
    console.log(`validate_length -> ${String(result)} mm`);
    return result;
  },
});

export const sumLengthsTool = defineTool('sum_lengths', {
  description: 'Additionne des longueurs entières non négatives en millimètres.',
  parameters: sumLengthsArgumentsSchema,
  handler: (toolArguments) => {
    const result = executeSumLengthsTool(toolArguments);
    console.log(`sum_lengths -> ${String(result)} mm`);
    return result;
  },
});

export function isPermittedToolRequest(kind: string, toolName: string | undefined): boolean {
  return kind === 'custom-tool' && toolName !== undefined && permittedToolNames.has(toolName);
}

function decideToolPermission(request: PermissionRequest): PermissionRequestResult {
  const toolName = request.kind === 'custom-tool' ? request.toolName : undefined;
  if (isPermittedToolRequest(request.kind, toolName)) {
    return { kind: 'approve-once' };
  }
  return { kind: 'reject', feedback: 'Seuls les outils de calcul de longueurs sont autorisés.' };
}

export async function runCopilotAgent(prompt: string): Promise<string> {
  if (prompt.trim().length === 0) {
    throw new TypeError('La demande doit être un texte non vide.');
  }

  const client = new CopilotClient({
    mode: 'copilot-cli',
    baseDirectory: process.env.COPILOT_HOME ?? join(homedir(), '.copilot'),
    useLoggedInUser: true,
  });
  await client.start();

  try {
    const session = await client.createSession({
      model: 'auto',
      systemMessage: {
        content: 'Ne calcule pas les longueurs toi-même. Utilise les outils disponibles et fonde les résultats numériques sur leurs retours.',
      },
      availableTools: new ToolSet()
        .addCustom('validate_length')
        .addCustom('sum_lengths'),
      tools: [validateLengthTool, sumLengthsTool],
      onPermissionRequest: decideToolPermission,
    });

    try {
      const response = await session.sendAndWait({ prompt });
      if (response === undefined) {
        throw new Error('Le modèle n’a fourni aucune réponse finale.');
      }
      return response.data.content;
    } finally {
      await session.disconnect();
    }
  } finally {
    await client.stop();
  }
}