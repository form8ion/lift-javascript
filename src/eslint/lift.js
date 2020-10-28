import {info} from '@travi/cli-messages';
import updateConfig from './config';

function getConfigToPackageNameMapper(scope) {
  return config => {
    if ('string' === typeof config) return `${scope}/eslint-config-${config}`;

    return `${scope}/eslint-config-${config.name}`;
  };
}

export default async function ({configs, scope, projectRoot}) {
  info('Configuring ESLint', {level: 'secondary'});

  if (!scope) throw new Error('No scope provided for ESLint configs');

  if (!configs) return {};

  await updateConfig({projectRoot, scope, configs});

  const mapConfigNameToPackageName = getConfigToPackageNameMapper(scope);

  return {
    devDependencies: configs.map(mapConfigNameToPackageName),
    nextSteps: [{summary: `extend the following additional ESLint configs: ${configs.join(', ')}`}]
  };
}
