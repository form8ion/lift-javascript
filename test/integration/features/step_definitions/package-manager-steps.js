import {Given} from '@cucumber/cucumber';
import {promises as fs} from 'fs';
import any from '@travi/any';
import td from 'testdouble';

Given('an {string} lockfile exists', async function (packageManager) {
  const {packageManagers} = require('@form8ion/javascript-core');

  if (packageManagers.NPM === packageManager) {
    await fs.writeFile(`${process.cwd()}/package-lock.json`, JSON.stringify(any.simpleObject()));

    td.when(this.execa(td.matchers.contains('. ~/.nvm/nvm.sh && nvm use && npm install'))).thenResolve({stdout: ''});
  }

  if (packageManagers.YARN === packageManager) {
    await fs.writeFile(`${process.cwd()}/yarn.lock`, any.string());

    td.when(this.execa(td.matchers.contains('. ~/.nvm/nvm.sh && nvm use && yarn add'))).thenResolve({stdout: ''});
  }

  this.packageManager = packageManager;
});

// TODO: move the td.verify for package installation here
