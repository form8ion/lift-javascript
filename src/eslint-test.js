import {assert} from 'chai';
import any from '@travi/any';
import liftEslint from './eslint';

suite('eslint lifter', () => {
  const scope = any.word();

  test('that an error is thrown if a scope is not provided', async () => {
    await assert.throws(() => liftEslint({}), 'No scope provided for ESLint configs');
  });

  test('that a `nextStep` is defined', () => {
    const configs = any.listOf(any.word);

    assert.deepEqual(
      liftEslint({configs, scope}).nextSteps,
      [{summary: `add eslint configs for: ${configs.join(', ')}`}]
    );
  });

  test('that no `nextStep` is added if no configs are provided', () => {
    assert.isUndefined(liftEslint({scope}).nextSteps);
  });
});
