// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import {lift, test} from './lib/index.cjs';

// remark-usage-ignore-next
stubbedFs();

// #### Execute

if (test({projectRoot: process.cwd()})) {
  lift({results: {dependencies: [], devDependencies: [], scripts: {}, elintConfigs: []}});
}
// remark-usage-ignore-next
stubbedFs.restore();
