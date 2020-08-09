import {promises as fs} from 'fs';
import * as jsCore from '@form8ion/javascript-core';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import liftPackage from './package';

suite('package.json lifter', () => {
  let sandbox;
  const projectRoot = any.string();
  const pathToPackageJson = `${projectRoot}/package.json`;
  const packageJsonContents = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(jsCore, 'installDependencies');
    sandbox.stub(fs, 'readFile');
    sandbox.stub(fs, 'writeFile');
  });

  teardown(() => sandbox.restore());

  suite('scripts', () => {
    test('that the scripts are added to the `package.json`', async () => {
      const scripts = any.simpleObject();
      const originalScripts = any.simpleObject();
      fs.readFile
        .withArgs(pathToPackageJson, 'utf8')
        .resolves(JSON.stringify({...packageJsonContents, scripts: originalScripts}));

      await liftPackage({projectRoot, scripts});

      assert.calledWith(
        fs.writeFile,
        pathToPackageJson,
        JSON.stringify({...packageJsonContents, scripts: {...originalScripts, ...scripts}}, null, 2)
      );
    });
  });

  suite('keywords', () => {
    test('that tags are added as keywords when none exist previously', async () => {
      const tags = any.listOf(any.word);
      fs.readFile
        .withArgs(pathToPackageJson, 'utf8')
        .resolves(JSON.stringify(packageJsonContents));

      await liftPackage({projectRoot, tags});

      assert.calledWith(
        fs.writeFile,
        pathToPackageJson,
        JSON.stringify({...packageJsonContents, scripts: {}, keywords: tags}, null, 2)
      );
    });

    test('that tags are added as keywords when some keywords already exist', async () => {
      const tags = any.listOf(any.word);
      const existingKeywords = any.listOf(any.word);
      fs.readFile
        .withArgs(pathToPackageJson, 'utf8')
        .resolves(JSON.stringify({...packageJsonContents, scripts: {}, keywords: existingKeywords}));

      await liftPackage({projectRoot, tags});

      assert.calledWith(
        fs.writeFile,
        pathToPackageJson,
        JSON.stringify({...packageJsonContents, scripts: {}, keywords: [...existingKeywords, ...tags]}, null, 2)
      );
    });
  });

  suite('dependencies', () => {
    const dependencies = any.listOf(any.word);
    const devDependencies = any.listOf(any.word);

    test('that dependencies and devDependencies are installed when provided', async () => {
      await liftPackage({projectRoot, dependencies, devDependencies});

      assert.calledWith(jsCore.installDependencies, dependencies, jsCore.PROD_DEPENDENCY_TYPE);
      assert.calledWith(jsCore.installDependencies, devDependencies, jsCore.DEV_DEPENDENCY_TYPE);
    });

    test('that only dependencies are installed when no dev-dependencies are provided', async () => {
      await liftPackage({projectRoot, dependencies});

      assert.calledWith(jsCore.installDependencies, dependencies, jsCore.PROD_DEPENDENCY_TYPE);
      assert.calledWith(jsCore.installDependencies, [], jsCore.DEV_DEPENDENCY_TYPE);
    });

    test('that only dev-dpendencies are installed when no dependencies are provided', async () => {
      await liftPackage({projectRoot, devDependencies});

      assert.calledWith(jsCore.installDependencies, devDependencies, jsCore.DEV_DEPENDENCY_TYPE);
      assert.calledWith(jsCore.installDependencies, [], jsCore.PROD_DEPENDENCY_TYPE);
    });
  });

  test('that no updates are applied if no new scripts or tags are provided', async () => {
    await liftPackage({});

    assert.notCalled(fs.readFile);
    assert.notCalled(fs.writeFile);
  });
});
