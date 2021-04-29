import {info} from '@travi/cli-messages';
import deepmerge from 'deepmerge';
import {lift as liftHusky} from '@form8ion/husky';
import {lift as liftEslint} from '@form8ion/eslint';
import liftPackage from './package';
import resolvePackageManager from './package-manager';

export default async function ({
  projectRoot,
  results: {scripts, tags, eslintConfigs, dependencies, devDependencies, packageManager: manager}
}) {
  info('Lifting JavaScript-specific details');

  const packageManager = await resolvePackageManager({projectRoot, packageManager: manager});
  const huskyResults = await liftHusky({projectRoot, packageManager});
  const {
    nextSteps,
    devDependencies: eslintDevDependencies
  } = await liftEslint({projectRoot, configs: eslintConfigs});

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
