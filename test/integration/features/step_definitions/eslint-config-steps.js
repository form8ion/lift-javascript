import {promises as fs} from 'fs';
import {dump, load} from 'js-yaml';
import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import any from '@travi/any';
import {fileExists} from '@form8ion/core';

import {assertDevDependencyIsInstalled} from './dependencies-steps';

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

Given('additional shareable configs are provided', async function () {
  this.additionalShareableConfigs = any.listOf(any.word);
});

Given('complex additional shareable configs are provided', async function () {
  this.additionalShareableConfigs = any.listOf(() => ({...any.simpleObject(), name: any.word()}));
});

Then('no eslint config file exists', async function () {
  assert.isFalse(await fileExists(pathToYamlConfig));
});

Then('the yaml eslint config file contains the expected config', async function () {
  const config = load(await fs.readFile(pathToYamlConfig));

  if (this.additionalShareableConfigs) {
    assert.equal(config.extends[0], eslintConfigScope);
    assert.includeMembers(
      config.extends,
      this.additionalShareableConfigs.map(cfg => {
        if ('string' === typeof cfg) return `${eslintConfigScope}/${cfg}`;

        return `${eslintConfigScope}/${cfg.name}`;
      })
    );
  } else {
    assert.deepEqual(config.extends, eslintConfigScope);
  }
});

Then('dependencies are defined for the additional configs', async function () {
  const additionalConfigPackageNames = this.additionalShareableConfigs.map(config => {
    if ('string' === typeof config) return `${this.eslintConfigScope}/eslint-config-${config}`;

    return `${this.eslintConfigScope}/eslint-config-${config.name}`;
  });

  assertDevDependencyIsInstalled(this.execa, additionalConfigPackageNames.join(' '));
});
