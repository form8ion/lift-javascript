import {info} from '@travi/cli-messages';
import liftScripts from './package';
import liftEslint from './eslint';

export default async function ({results: {scripts, tags, eslintConfigs}, projectRoot}) {
  info('Lifting JavaScript-specific details');

  await liftScripts({projectRoot, scripts, tags});

  return liftEslint({configs: eslintConfigs});
}
