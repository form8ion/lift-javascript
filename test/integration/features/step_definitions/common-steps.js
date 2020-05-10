// eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
import {lift} from '@form8ion/lift-javascript';
import stubbedFs from 'mock-fs';
import any from '@travi/any';
import {After, Before, When} from 'cucumber';

Before(async function () {
  this.existingScripts = any.simpleObject();

  stubbedFs({
    'package.json': JSON.stringify({scripts: this.existingScripts})
  });
});

After(function () {
  stubbedFs.restore();
});

When('the scaffolder results are processed', async function () {
  await lift({
    projectRoot: process.cwd(),
    results: {scripts: this.scriptsResults}
  });
});
