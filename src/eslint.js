export default function ({configs}) {
  return {
    ...configs && {nextSteps: [{summary: `add eslint configs for: ${configs.join(', ')}`}]}
  };
}
