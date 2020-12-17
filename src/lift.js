import {info, warn} from '@travi/cli-messages';
import deepmerge from 'deepmerge';
import liftPackage from './package';
import liftEslint from './eslint';
import liftHusky from './husky';

function configIsProvidedForEslint(configs) {
  return configs && configs.eslint;
}

export default async function ({
  projectRoot,
  configs,
  results: {scripts, tags, eslintConfigs, dependencies, devDependencies}
}) {
  info('Lifting JavaScript-specific details');

  const huskyResults = await liftHusky({projectRoot});

  if (configIsProvidedForEslint(configs)) {
    const {
      nextSteps,
      devDependencies: eslintDevDependencies
    } = await liftEslint({configs: eslintConfigs, scope: configs.eslint.scope, projectRoot});

    await liftPackage({projectRoot, scripts, tags, dependencies, devDependencies, eslintDevDependencies});

    return deepmerge({nextSteps}, huskyResults);
  }

  if (eslintConfigs) warn('Config for ESLint not provided. Skipping ESLint configuration');

  await liftPackage({projectRoot, scripts, tags, dependencies, devDependencies});

  return huskyResults;
}
