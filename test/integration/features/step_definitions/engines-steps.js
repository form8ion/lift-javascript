import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import {assert} from 'chai';

Given('a definition exists for engines.node', async function () {
  this.enginesNode = any.word();
});

Then('the engines badge is added to the consumer group', async function () {
  const {badges} = this.results;

  assert.deepEqual(
    badges.consumer.node,
    {
      img: `https://img.shields.io/node/v/${this.projectName}.svg`,
      text: 'node'
    }
  );
});
