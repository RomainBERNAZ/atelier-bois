import { runCopilotAgent } from './copilot-agent.ts';

const response = await runCopilotAgent(
  'Utilise validate_length pour valider 400 mm, puis sum_lengths pour additionner 400 mm et 600 mm. Réponds en français à partir des résultats des outils.',
);

console.log(response);