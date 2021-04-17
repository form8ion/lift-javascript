import {info, warn} from '@travi/cli-messages';
import deepmerge from 'deepmerge';
import {lift as liftHusky} from '@form8ion/husky';
import liftPackage from './package';
import liftEslint from './eslint';

function configIsProvidedForEslint(configs) {
  return configs && configs.eslint;
}

export default async function ({
  projectRoot,
  configs,
  results: {scripts, tags, eslintConfigs, dependencies, devDependencies, packageManager}
}) {
  info('Lifting JavaScript-specific details');

  const huskyResults = await liftHusky({projectRoot, packageManager});

  if (configIsProvidedForEslint(configs)) {
    const {
      nextSteps,
      devDependencies: eslintDevDependencies
    } = await liftEslint({configs: eslintConfigs, scope: configs.eslint.scope, projectRoot});

    await liftPackage(
      deepmerge(
        {
          projectRoot,
          scripts,
          tags,
          dependencies,
          devDependencies,
          packageManager,
          eslintDevDependencies
        },
        huskyResults
      )
    );

    return {nextSteps};
  }

  if (eslintConfigs) warn('Config for ESLint not provided. Skipping ESLint configuration');

  await liftPackage(
    deepmerge(
      {projectRoot, scripts, tags, dependencies, devDependencies, packageManager},
      huskyResults
    )
  );

  return {};
}
