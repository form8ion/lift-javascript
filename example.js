// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import {lift, test} from './lib/index.cjs';

// remark-usage-ignore-next
stubbedFs();

// #### Execute

const projectRoot = process.cwd();

(async () => {
  if (await test({projectRoot})) {
    await lift({
      projectRoot,
      configs: {eslint: {scope: '@foo'}},
      results: {dependencies: [], devDependencies: [], scripts: {}, eslintConfigs: []}
    });
  }
})();

// remark-usage-ignore-next
stubbedFs.restore();
