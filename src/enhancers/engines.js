import {promises as fs} from 'fs';

export async function test({projectRoot}) {
  const {engines} = JSON.parse(await fs.readFile(`${projectRoot}/package.json`, 'utf8'));

  return !!engines?.node;
}

export async function lift({projectRoot}) {
  const {name} = JSON.parse(await fs.readFile(`${projectRoot}/package.json`, 'utf8'));

  return {
    devDependencies: ['ls-engines'],
    scripts: {'lint:engines': 'ls-engines'},
    badges: {consumer: {node: {img: `https://img.shields.io/node/v/${name}?logo=node.js`, text: 'node'}}}
  };
}
