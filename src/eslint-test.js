import {assert} from 'chai';
import any from '@travi/any';
import liftEslint from './eslint';

suite('eslint lifter', () => {
  test('that a `nextStep` is defined', () => {
    const configs = any.listOf(any.word);

    assert.deepEqual(
      liftEslint({configs}).nextSteps,
      [{summary: `add eslint configs for: ${configs.join(', ')}`}]
    );
  });

  test('that no `nextStep` is added if no configs are provided', () => {
    assert.isUndefined(liftEslint({}).nextSteps);
  });
});
