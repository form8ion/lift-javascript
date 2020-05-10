import {promises as fs} from 'fs';
import any from '@travi/any';
import {assert} from 'chai';
import {Given, Then} from 'cucumber';

Given('there are no existing keywords', async function () {
  return undefined;
});

Given('tags are provided in the results', async function () {
  this.tagsResults = any.listOf(any.word);
});

Given('there are existing keywords', async function () {
  this.existingKeywords = any.listOf(any.word);
});

Then('keywords from the results exist', async function () {
  const {keywords} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf8'));

  this.tagsResults.forEach(tag => {
    assert.isTrue(keywords.includes(tag));
  });
});

Then('the existing keywords still exist', async function () {
  const {keywords} = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf8'));

  this.existingKeywords.forEach(existingKeyword => {
    assert.isTrue(keywords.includes(existingKeyword));
  });
});
