import {info, warn} from '@travi/cli-messages';
import liftPackage from './package';
import liftEslint from './eslint';

function configIsProvidedForEslint(configs) {
  return configs && configs.eslint;
}

export default async function ({
  projectRoot,
  configs,
  results: {scripts, tags, eslintConfigs, dependencies, devDependencies}
}) {
  info('Lifting JavaScript-specific details');

  if (configIsProvidedForEslint(configs)) {
    const {
      nextSteps,
      devDependencies: eslintDevDependencies
    } = await liftEslint({configs: eslintConfigs, scope: configs.eslint.scope, projectRoot});

    await liftPackage({projectRoot, scripts, tags, dependencies, devDependencies, eslintDevDependencies});

    return {nextSteps};
  }

  if (eslintConfigs) warn('Config for ESLint not provided. Skipping ESLint configuration');

  await liftPackage({projectRoot, scripts, tags, dependencies, devDependencies});

  return {};
}
