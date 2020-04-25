import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as scriptsLifter from './scripts';
import lift from './lift';

suite('lift', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(scriptsLifter, 'default');
  });

  teardown(() => sandbox.restore());

  test('that results specific to js projects are lifted', async () => {
    const projectRoot = any.string();
    const scripts = any.simpleObject();
    const results = {...any.simpleObject(), scripts};

    await lift({projectRoot, results});

    assert.calledWith(scriptsLifter.default, {projectRoot, scripts});
  });
});
