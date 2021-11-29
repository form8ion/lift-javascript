import * as huskyLifter from '@form8ion/husky';

import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';

import {enhanceHuskyEnhancer} from './enhanced-enhancers';

suite('enhanced enhancers', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(huskyLifter, 'lift');
  });

  teardown(() => sandbox.restore());

  test('that the package manager is passed to the husky enhancer', async () => {
    const packageManager = any.word();
    const results = any.simpleObject();
    const projectRoot = any.string();
    const huskyLiftResults = any.simpleObject();
    huskyLifter.lift.withArgs({projectRoot, packageManager, results}).resolves(huskyLiftResults);

    const enhancedHuskyEnhancer = enhanceHuskyEnhancer(packageManager);

    assert.equal(await enhancedHuskyEnhancer.lift({results, projectRoot}), huskyLiftResults);
    assert.equal(enhancedHuskyEnhancer.test, huskyLifter.test);
  });
});
