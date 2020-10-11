import {assert} from 'chai';
import any from '@travi/any';
import liftEslint from './eslint';

suite('eslint lifter', () => {
  const scope = any.word();

  test('that an error is thrown if a scope is not provided', async () => {
    await assert.throws(() => liftEslint({}), 'No scope provided for ESLint configs');
  });

  test('that no `nextStep` is added if no configs are provided', () => {
    assert.isUndefined(liftEslint({scope}).nextSteps);
  });

  test('that dependencies are listed for requested simple configs', () => {
    const configs = any.listOf(any.word);

    const {nextSteps, devDependencies} = liftEslint({configs, scope});

    assert.deepEqual(
      nextSteps,
      [{summary: `extend the following additional ESLint configs: ${configs.join(', ')}`}]
    );
    assert.deepEqual(devDependencies, configs.map(config => `${scope}/eslint-config-${config}`));
  });

  test('that dependencies are listed for requested complex configs', () => {
    const configs = any.listOf(() => ({...any.simpleObject(), name: any.word()}));

    const {nextSteps, devDependencies} = liftEslint({configs, scope});

    assert.deepEqual(
      nextSteps,
      [{summary: `extend the following additional ESLint configs: ${configs.join(', ')}`}]
    );
    assert.deepEqual(devDependencies, configs.map(config => `${scope}/eslint-config-${config.name}`));
  });
});
