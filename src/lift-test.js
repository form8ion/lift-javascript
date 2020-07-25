import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as scriptsLifter from './package';
import * as eslintLifter from './eslint';
import lift from './lift';

suite('lift', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(scriptsLifter, 'default');
    sandbox.stub(eslintLifter, 'default');
  });

  teardown(() => sandbox.restore());

  test('that results specific to js projects are lifted', async () => {
    const projectRoot = any.string();
    const scripts = any.simpleObject();
    const tags = any.listOf(any.word);
    const eslintConfigs = any.listOf(any.word);
    const results = {...any.simpleObject(), scripts, tags, eslintConfigs};
    const eslintLiftResults = {...any.simpleObject(), nextSteps: any.listOf(any.simpleObject)};
    eslintLifter.default.withArgs({configs: eslintConfigs}).resolves(eslintLiftResults);

    const liftResults = await lift({projectRoot, results});

    assert.deepEqual(liftResults, eslintLiftResults);
    assert.calledWith(scriptsLifter.default, {projectRoot, scripts, tags});
  });
});
