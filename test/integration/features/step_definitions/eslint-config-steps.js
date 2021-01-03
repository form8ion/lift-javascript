import {promises as fs} from 'fs';
import {dump, load} from 'js-yaml';
import {Given, Then} from 'cucumber';
import {assert} from 'chai';
import any from '@travi/any';
import {fileExists} from '@form8ion/core';

const pathToYamlConfig = `${process.cwd()}/.eslintrc.yml`;
const eslintConfigScope = `@${any.word()}`;

Given('no existing eslint config file is present', async function () {
  this.eslintConfigScope = eslintConfigScope;

  return undefined;
});

Given('an existing eslint config file is present', async function () {
  this.eslintConfigScope = eslintConfigScope;

  await fs.writeFile(pathToYamlConfig, dump({extends: eslintConfigScope}));
});

Then('no eslint config file exists', async function () {
  assert.isFalse(await fileExists(pathToYamlConfig));
});

Then('the yaml eslint config file contains the expected config', async function () {
  const config = load(await fs.readFile(pathToYamlConfig));

  assert.deepEqual(config.extends, eslintConfigScope);
});
