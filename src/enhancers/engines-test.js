import {promises as fs} from 'fs';

import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';

import {test as predicate, lift} from './engines';

suite('engines enhancer', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'readFile');
  });

  teardown(() => sandbox.restore());

  test('that the predicate returns `true` when `engines.node` is defined', async () => {
    fs.readFile.withArgs(`${projectRoot}/package.json`, 'utf8').resolves(JSON.stringify({engines: {node: any.word()}}));

    assert.isTrue(await predicate({projectRoot}));
  });

  test('that the predicate returns `false` when `engines.node` is not defined', async () => {
    fs.readFile.resolves(JSON.stringify({engines: {}}));

    assert.isFalse(await predicate({projectRoot}));
  });

  test('that the predicate returns `false` when `engines` is not defined', async () => {
    fs.readFile.resolves(JSON.stringify({}));

    assert.isFalse(await predicate({projectRoot}));
  });

  test('that the lifter returns the details for linting and communicating engines restrictions', async () => {
    const projectName = any.word();
    fs.readFile.withArgs(`${projectRoot}/package.json`, 'utf8').resolves(JSON.stringify({name: projectName}));

    const {scripts, badges, devDependencies} = await lift({projectRoot});

    assert.equal(scripts['lint:engines'], 'ls-engines');
    assert.deepEqual(devDependencies, ['ls-engines']);
    assert.deepEqual(badges.consumer.node, {img: `https://img.shields.io/node/v/${projectName}.svg`, text: 'node'});
  });
});
