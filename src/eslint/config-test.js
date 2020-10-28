import {promises as fs} from 'fs';
import jsYaml from 'js-yaml';
import * as core from '@form8ion/core';
import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';
import updateConfig from './config';

suite('eslint config', () => {
  const projectRoot = any.string();
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(core, 'fileExists');
    sandbox.stub(fs, 'readFile');
    sandbox.stub(fs, 'writeFile');
    sandbox.stub(jsYaml, 'safeLoad');
    sandbox.stub(jsYaml, 'safeDump');
  });

  teardown(() => sandbox.restore());

  test('that no error is thrown if a config file does not exist', async () => {
    core.fileExists.resolves(false);

    await updateConfig({projectRoot});

    assert.notCalled(fs.writeFile);
  });

  test('that the config is updated to include the provided simple configs', async () => {
    const pathToConfigFile = `${projectRoot}/.eslintrc.yml`;
    const dumpedYaml = any.string();
    const existingFile = any.simpleObject();
    const existingConfigs = any.listOf(any.word);
    const existingConfig = {...any.simpleObject(), extends: existingConfigs};
    const providedConfigs = any.listOf(any.word);
    const scope = any.word();
    core.fileExists.withArgs(pathToConfigFile).resolves(true);
    fs.readFile.withArgs(pathToConfigFile).resolves(existingFile);
    jsYaml.safeLoad.withArgs(existingFile).returns(existingConfig);
    jsYaml.safeDump
      .withArgs({
        ...existingConfig,
        extends: [...existingConfigs, ...providedConfigs.map(config => `${scope}/${config}`)]
      })
      .returns(dumpedYaml);

    await updateConfig({projectRoot, scope, configs: providedConfigs});

    assert.calledWith(fs.writeFile, pathToConfigFile, dumpedYaml);
  });
});
