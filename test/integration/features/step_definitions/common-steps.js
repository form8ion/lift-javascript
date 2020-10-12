import {resolve} from 'path';
import {promises as fs} from 'fs';
import stubbedFs from 'mock-fs';
import td from 'testdouble';
import any from '@travi/any';
import {After, Before, When} from 'cucumber';

const pathToNodeModules = [__dirname, '../../../../', 'node_modules/'];
const stubbedNodeModules = stubbedFs.load(resolve(...pathToNodeModules));

let lift;

Before(async function () {
  this.execa = td.replace('execa');

  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  const jsLift = require('@form8ion/lift-javascript');
  lift = jsLift.lift;

  this.existingScripts = any.simpleObject();

  stubbedFs({node_modules: stubbedNodeModules});
});

After(function () {
  stubbedFs.restore();
});

When('the scaffolder results are processed', async function () {
  await fs.writeFile(
    `${process.cwd()}/package.json`,
    JSON.stringify({
      scripts: this.existingScripts,
      keywords: this.existingKeywords
    })
  );

  await lift({
    projectRoot: process.cwd(),
    results: {scripts: this.scriptsResults, tags: this.tagsResults},
    ...this.eslintConfigScope && {configs: {eslint: {scope: this.eslintConfigScope}}}
  });
});
