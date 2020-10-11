import {info, warn} from '@travi/cli-messages';
import liftPackage from './package';
import liftEslint from './eslint';

export default async function ({
  projectRoot,
  configs,
  results: {scripts, tags, eslintConfigs, dependencies, devDependencies}
}) {
  info('Lifting JavaScript-specific details');

  await liftPackage({projectRoot, scripts, tags, dependencies, devDependencies});

  if (configs && configs.eslint) return liftEslint({configs: eslintConfigs, scope: configs.eslint.scope});

  warn('Config for ESLint not provided. Skipping ESLint configuration');

  return {};
}
