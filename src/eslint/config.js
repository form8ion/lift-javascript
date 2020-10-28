import {promises as fs} from 'fs';
import {safeDump, safeLoad} from 'js-yaml';
import {warn} from '@travi/cli-messages';
import {fileExists} from '@form8ion/core';

export default async function ({projectRoot, scope, configs}) {
  const pathToConfigFile = `${projectRoot}/.eslintrc.yml`;

  if (await fileExists(pathToConfigFile)) {
    const existingConfig = safeLoad(await fs.readFile(pathToConfigFile));
    await fs.writeFile(
      pathToConfigFile,
      safeDump({
        ...existingConfig,
        extends: [...existingConfig.extends, ...configs.map(config => `${scope}/${config}`)]
      })
    );
  } else {
    warn(`No \`.eslintrc.yml\` file found, so skipping extension of provided configs: ${configs.join(', ')}`);
  }
}
