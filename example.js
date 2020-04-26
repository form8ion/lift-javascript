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
      results: {dependencies: [], devDependencies: [], scripts: {}, elintConfigs: []},
      projectRoot
    });
  }
})();

// remark-usage-ignore-next
stubbedFs.restore();
