import {info} from '@travi/cli-messages';

export default function ({configs, scope}) {
  info('Configuring ESLint', {level: 'secondary'});

  if (!scope) throw new Error('No scope provided for ESLint configs');

  return {
    ...configs && {nextSteps: [{summary: `add eslint configs for: ${configs.join(', ')}`}]}
  };
}
