import {promises as fs} from 'fs';
import jsYaml from 'js-yaml';
import * as cliMessages from '@travi/cli-messages';
import * as core from '@form8ion/core';
import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';
import updateConfig from './config';

suite('eslint config', () => {
  let sandbox;
  const projectRoot = any.string();
  const providedConfigs = any.listOf(any.word);

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(core, 'fileExists');
    sandbox.stub(fs, 'readFile');
    sandbox.stub(fs, 'writeFile');
    sandbox.stub(jsYaml, 'safeLoad');
    sandbox.stub(jsYaml, 'safeDump');
    sandbox.stub(cliMessages, 'warn');
  });

  teardown(() => sandbox.restore());

  test('that no error is thrown if a config file does not exist', async () => {
    core.fileExists.resolves(false);

    await updateConfig({projectRoot, configs: providedConfigs});

    assert.notCalled(fs.writeFile);
    assert.calledWith(
      cliMessages.warn,
      `No \`.eslintrc.yml\` file found, so skipping extension of provided configs: ${providedConfigs.join(', ')}`
    );
  });

  test('that the config is updated to include the provided simple configs', async () => {
    const pathToConfigFile = `${projectRoot}/.eslintrc.yml`;
    const dumpedYaml = any.string();
    const existingFile = any.simpleObject();
    const existingConfigs = any.listOf(any.word);
    const existingConfig = {...any.simpleObject(), extends: existingConfigs};
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
    assert.notCalled(cliMessages.warn);
  });
});
