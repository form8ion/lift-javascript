import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';
import applyEnhancers from './apply';

suite('enhancers', () => {
  const results = any.simpleObject();
  const projectRoot = any.string();

  test('that an enhancer that matches the project is executed', async () => {
    const lift = sinon.stub();
    const anotherLift = sinon.stub();
    const test = sinon.stub();
    const otherLift = sinon.spy();
    const liftNextSteps = any.listOf(any.simpleObject);
    const liftResults = {nextSteps: liftNextSteps};
    const anotherLiftResults = any.simpleObject();
    test.withArgs({projectRoot}).resolves(true);
    lift.withArgs({results, projectRoot}).resolves(liftResults);
    anotherLift.withArgs({results: {...results, ...liftResults}, projectRoot}).resolves(anotherLiftResults);

    const enhancerResults = await applyEnhancers({
      results,
      projectRoot,
      enhancers: {
        [any.word()]: {test, lift},
        [any.word()]: {test: () => Promise.resolve(false), lift: otherLift},
        [any.word()]: {test, lift: anotherLift}
      }
    });

    assert.deepEqual(enhancerResults, {...results, ...liftResults, ...anotherLiftResults});
    assert.calledWith(lift, {results, projectRoot});
    assert.notCalled(otherLift);
  });

  test('that an enhancer error rejects the enhancer application', async () => {
    const error = new Error('from test');

    try {
      await applyEnhancers({
        results,
        projectRoot,
        enhancers: {
          [any.word()]: {
            test: () => Promise.resolve(true),
            lift: () => Promise.reject(error)
          }
        }
      });

      throw new Error('applying enhancers should have thrown an error');
    } catch (e) {
      assert.equal(e, error);
    }
  });

  test('that no liftEnhancers are applied if none are provided', async () => {
    assert.deepEqual(await applyEnhancers({results}), results);
  });
});
