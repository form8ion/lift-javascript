import {Then} from '@cucumber/cucumber';
import td from 'testdouble';

function escapeSpecialCharacters(string) {
  return string.replace(/[.*+?^$\-{}()|[\]\\]/g, '\\$&');
}

export function assertDevDependencyIsInstalled(execa, dependencyName) {
  const {DEV_DEPENDENCY_TYPE} = require('@form8ion/javascript-core');

  td.verify(
    execa(td.matchers.contains(
      new RegExp(`(npm install|yarn add).*${escapeSpecialCharacters(dependencyName)}.*${DEV_DEPENDENCY_TYPE}`)
    )),
    {ignoreExtraArgs: true}
  );
}

Then('ls-engines is added as a dependency', async function () {
  assertDevDependencyIsInstalled(this.execa, 'ls-engines');
});
