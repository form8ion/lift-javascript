import {promises as fs} from 'fs';
import makeDir from 'make-dir';
import {Given, Then} from 'cucumber';
import any from '@travi/any';
import td from 'testdouble';
import {assert} from 'chai';

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
  td.when(this.execa('npm', ['ls', 'husky', '--json'])).thenResolve({stdout: JSON.stringify({})});
});

Given('husky config is in v4 format', async function () {
  await fs.writeFile(`${process.cwd()}/.huskyrc.json`, JSON.stringify(any.simpleObject()));
});

Given('husky config is in v5 format', async function () {
  await makeDir(`${process.cwd()}/.husky`);
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
