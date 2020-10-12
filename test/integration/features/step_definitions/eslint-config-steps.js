import {promises as fs} from 'fs';
import {safeDump, safeLoad} from 'js-yaml';
import {Given, Then} from 'cucumber';
import {assert} from 'chai';
import {fileExists} from '@form8ion/core';

const pathToYamlConfig = `${process.cwd()}/.eslintrc.yml`;

Given('no existing eslint config file is present', async function () {
  return undefined;
});

Given('an existing eslint config file is present', async function () {
  await fs.writeFile(pathToYamlConfig, safeDump({extends: 'foo'}));
});

Then('no eslint config file exists', async function () {
  assert.isFalse(await fileExists(pathToYamlConfig));
});

Then('the yaml eslint config file contains the expected config', async function () {
  const config = safeLoad(await fs.readFile(pathToYamlConfig));

  assert.deepEqual(config.extends, 'foo');
});
