import deepmerge from 'deepmerge';
import {info} from '@travi/cli-messages';
import {lift as liftHusky} from '@form8ion/husky';
import {lift as liftEslint} from '@form8ion/eslint';

import applyEnhancers from './enhancers/apply';
import * as enginesEnhancer from './enhancers/engines';
import liftPackage from './package';
import resolvePackageManager from './package-manager';

export default async function ({projectRoot, results}) {
  info('Lifting JavaScript-specific details');

  const {scripts, tags, eslintConfigs, dependencies, devDependencies, packageManager: manager} = results;

  const packageManager = await resolvePackageManager({projectRoot, packageManager: manager});

  const huskyResults = await liftHusky({projectRoot, packageManager});
  const eslintResults = await liftEslint({projectRoot, configs: eslintConfigs});
  const enhancerResults = await applyEnhancers({results, enhancers: [enginesEnhancer], projectRoot});

  await liftPackage(
    deepmerge.all([
      {projectRoot, scripts, tags, dependencies, devDependencies, packageManager},
      enhancerResults,
      huskyResults,
      eslintResults
    ])
  );

  return enhancerResults;
}
