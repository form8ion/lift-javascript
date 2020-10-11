// eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
import {lift} from '@form8ion/lift-javascript';
import {resolve} from 'path';
import stubbedFs from 'mock-fs';
import any from '@travi/any';
import {After, Before, When} from 'cucumber';

const packagePreviewDirectory = '../__package_previews__/lift-javascript';
const pathToNodeModules = [__dirname, '../../../../', 'node_modules/'];
const stubbedNodeModules = stubbedFs.load(resolve(...pathToNodeModules));

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
    }),
    [packagePreviewDirectory]: {
      '@form8ion': {
        'lift-javascript': {
          // node_modules: stubbedNodeModules,
          node_modules: {
            '.pnpm': {
              node_modules: stubbedNodeModules,
              'ansi-styles@4.3.0': {node_modules: stubbedNodeModules}
            }
          }
        }
      }
    }
  });

  await lift({
    projectRoot: process.cwd(),
    results: {scripts: this.scriptsResults, tags: this.tagsResults}
  });
});
