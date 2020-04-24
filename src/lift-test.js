import lift from './lift';

suite('lift', () => {
  test('that results specific to js projects are lifted', async () => {
    await lift();
  });
});
