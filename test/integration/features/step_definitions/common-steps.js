// eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
import {lift} from '@form8ion/lift-javascript';
import {resolve} from 'path';
import {promises as fs} from 'fs';
import stubbedFs from 'mock-fs';
import any from '@travi/any';
import {After, Before, When} from 'cucumber';

const packagePreviewDirectory = '../__package_previews__/lift-javascript';
const pathToNodeModules = [__dirname, '../../../../', 'node_modules/'];

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
          node_modules: {
            '.pnpm': {
              node_modules: {
                'color-name': {'index.js': await fs.readFile(resolve(...pathToNodeModules, 'color-name/index.js'))}
              },
              'ansi-styles@4.2.1': {
                node_modules: {
                  'color-convert': {
                    'index.js': await fs.readFile(resolve(...pathToNodeModules, 'color-convert/index.js')),
                    'conversions.js': await fs.readFile(resolve(...pathToNodeModules, 'color-convert/conversions.js')),
                    'route.js': await fs.readFile(resolve(...pathToNodeModules, 'color-convert/route.js'))
                  }
                }
              }
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
