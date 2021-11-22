import {promises as fs} from 'fs';
import any from '@travi/any';
import {assert} from 'chai';
import {Given, Then} from '@cucumber/cucumber';

Given('no additional scripts are included in the results', async function () {
  this.scriptsResults = undefined;
});

Given('additional scripts are included in the results', async function () {
  this.scriptsResults = any.simpleObject();
});

Given('additional scripts that duplicate existing scripts are included in the results', async function () {
  this.scriptsResults = any.objectWithKeys(Object.keys(this.existingScripts));
});

Then('the existing scripts still exist', async function () {
  const {scripts} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf8'));

  Object.entries(this.existingScripts).forEach(([scriptName, script]) => assert.equal(scripts[scriptName], script));
});

Then('no extra scripts were added', async function () {
  const {scripts} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf8'));

  assert.equal(Object.keys(scripts).length, Object.keys(this.existingScripts).length);
});

Then('the additional scripts exist', async function () {
  const {scripts} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf8'));

  Object.entries(this.scriptsResults).forEach(([scriptName, script]) => assert.equal(scripts[scriptName], script));
});
