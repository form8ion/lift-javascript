import {promises as fs} from 'fs';
import {fileExists} from '@form8ion/core';
import makeDir from 'make-dir';
import {Given, Then} from 'cucumber';
import any from '@travi/any';
import td from 'testdouble';
import {assert} from 'chai';
import {packageManagers} from '@form8ion/javascript-core';

export async function assertHookContainsScript(hook, script) {
  const hookContents = await fs.readFile(`${process.cwd()}/.husky/${hook}`, 'utf-8');

  assert.include(
    hookContents,
    `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"`
  );
  assert.include(hookContents, script);
}

Given('husky v5 is installed', async function () {
  td
    .when(this.execa('npm', ['ls', 'husky', '--json']))
    .thenResolve({stdout: JSON.stringify({dependencies: {husky: {version: '5.0.0'}}})});
});

Given('husky v4 is installed', async function () {
  td
    .when(this.execa('npm', ['ls', 'husky', '--json']))
    .thenResolve({stdout: JSON.stringify({dependencies: {husky: {version: '4.5.6'}}})});
});

Given('husky is not installed', async function () {
  const error = new Error('Command failed with exit code 1: npm ls husky --json');
  error.exitCode = 1;
  error.stdout = JSON.stringify({});
  error.command = 'npm ls husky --json';

  td.when(this.execa('npm', ['ls', 'husky', '--json'])).thenReject(error);
});

Given('husky config is in v4 format', async function () {
  await fs.writeFile(`${process.cwd()}/.huskyrc.json`, JSON.stringify(any.simpleObject()));
});

Given('husky config is in v5 format', async function () {
  await makeDir(`${process.cwd()}/.husky`);
});

Given('{string} is the package manager', async function (packageManager) {
  this.packageManager = packageManager;
});

Then('the next-steps include a warning about the husky config', async function () {
  assert.deepInclude(
    this.results.nextSteps,
    {summary: 'Husky configuration is outdated for the installed Husky version'}
  );
});

Then('the next-steps do not include a warning about the husky config', async function () {
  const {nextSteps} = this.results;

  if (nextSteps) {
    assert.notDeepInclude(nextSteps, {summary: 'Husky configuration is outdated for the installed Husky version'});
  }
});

Then('husky is configured for {string}', async function (packageManager) {
  if (packageManagers.NPM === packageManager) {
    td.verify(this.execa(td.matchers.contains('. ~/.nvm/nvm.sh && nvm use && npm install')), {ignoreExtraArgs: true});
  }
  if (packageManagers.YARN === packageManager) {
    td.verify(this.execa(td.matchers.contains('. ~/.nvm/nvm.sh && nvm use && yarn add')), {ignoreExtraArgs: true});
  }
  td.verify(this.execa(td.matchers.contains('husky@latest')), {ignoreExtraArgs: true});
  assert.equal(
    JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8')).scripts.prepare,
    'husky install'
  );
  await assertHookContainsScript('pre-commit', `${packageManager} test`);
});

Then('the v4 config is removed', async function () {
  assert.isFalse(await fileExists(`${process.cwd()}/.huskyrc.json`));
});
