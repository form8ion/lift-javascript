import {fileExists} from '@form8ion/core';
import {packageManagers} from '@form8ion/javascript-core';

export default async function ({projectRoot, packageManager}) {
  if (packageManager) return packageManager;

  if (await fileExists(`${projectRoot}/package-lock.json`)) {
    return packageManagers.NPM;
  }

  if (await fileExists(`${projectRoot}/yarn.lock`)) {
    return packageManagers.YARN;
  }

  throw new Error('Package-manager could not be determined');
}
