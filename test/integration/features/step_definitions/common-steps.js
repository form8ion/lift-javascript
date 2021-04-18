import {resolve} from 'path';
import {promises as fs} from 'fs';
import {packageManagers} from '@form8ion/javascript-core';
import stubbedFs from 'mock-fs';
import td from 'testdouble';
import importFresh from 'import-fresh';
import clearModule from 'clear-module';
import any from '@travi/any';
import {After, Before, Given, When} from 'cucumber';

const pathToNodeModules = [__dirname, '../../../../', 'node_modules/'];
const stubbedNodeModules = stubbedFs.load(resolve(...pathToNodeModules));

let lift;

Before(async function () {
  this.execa = td.replace('execa');

  ({lift} = importFresh('@form8ion/lift-javascript'));

  this.existingScripts = any.simpleObject();

  stubbedFs({node_modules: stubbedNodeModules});
});

After(function () {
  stubbedFs.restore();
  td.reset();
  clearModule('@form8ion/husky');
  clearModule('@form8ion/javascript-core');
});

Given('an {string} lockfile exists', async function (packageManager) {
  if (packageManagers.NPM === packageManager) {
    await fs.writeFile(`${process.cwd()}/package-lock.json`, JSON.stringify(any.simpleObject()));
  }

  if (packageManagers.YARN === packageManager) {
    await fs.writeFile(`${process.cwd()}/yarn.lock`, any.string());
  }
});

When('the scaffolder results are processed', async function () {
  await fs.writeFile(
    `${process.cwd()}/package.json`,
    JSON.stringify({
      scripts: this.existingScripts,
      keywords: this.existingKeywords
    })
  );

  this.results = await lift({
    projectRoot: process.cwd(),
    results: {scripts: this.scriptsResults, tags: this.tagsResults, packageManager: this.packageManager},
    ...this.eslintConfigScope && {configs: {eslint: {scope: this.eslintConfigScope}}}
  });
});
