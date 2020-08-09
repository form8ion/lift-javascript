import {info} from '@travi/cli-messages';
import liftPackage from './package';
import liftEslint from './eslint';

export default async function ({results: {scripts, tags, eslintConfigs, dependencies, devDependencies}, projectRoot}) {
  info('Lifting JavaScript-specific details');

  await liftPackage({projectRoot, scripts, tags, dependencies, devDependencies});

  return liftEslint({configs: eslintConfigs});
}
