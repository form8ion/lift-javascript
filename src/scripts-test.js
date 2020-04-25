import {promises as fs} from 'fs';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import liftScripts from './scripts';

suite('scripts lifter', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'readFile');
    sandbox.stub(fs, 'writeFile');
  });

  teardown(() => sandbox.restore());

  test('that the scripts are added to the `package.json`', async () => {
    const pathToPackageJson = `${projectRoot}/package.json`;
    const scripts = any.simpleObject();
    const originalScripts = any.simpleObject();
    const packageJsonContents = any.simpleObject();
    fs.readFile
      .withArgs(pathToPackageJson, 'utf8')
      .resolves(JSON.stringify({...packageJsonContents, scripts: originalScripts}));

    await liftScripts({projectRoot, scripts});

    assert.calledWith(
      fs.writeFile,
      pathToPackageJson,
      JSON.stringify({...packageJsonContents, scripts: {...originalScripts, ...scripts}}, null, 2)
    );
  });

  test('that no updates are applied if no new scripts are provided', async () => {
    await liftScripts({});

    assert.notCalled(fs.readFile);
    assert.notCalled(fs.writeFile);
  });
});
