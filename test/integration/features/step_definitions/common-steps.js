// eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
import {lift} from '@form8ion/lift-javascript';
import stubbedFs from 'mock-fs';
import any from '@travi/any';
import {After, Before, When} from 'cucumber';

Before(async function () {
  this.existingScripts = any.simpleObject();
});

After(function () {
  stubbedFs.restore();
});

When('the scaffolder results are processed', async function () {
  stubbedFs({
    'package.json': JSON.stringify({
      scripts: this.existingScripts,
      keywords: this.existingKeywords
    })
  });

  await lift({
    projectRoot: process.cwd(),
    results: {scripts: this.scriptsResults, tags: this.tagsResults}
  });
});
