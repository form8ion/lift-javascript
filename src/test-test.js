import testApplicability from './test';

suite('applicability test', () => {
  test('that `true` is returned if the project has an `.nvmrc` file', async () => {
    await testApplicability();
  });

  test('that `false` is returned if the project does not have an `.nvmrc` file', async () => {

  });
});
