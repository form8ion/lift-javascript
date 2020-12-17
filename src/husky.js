import semver from 'semver';
import {fileExists} from '@form8ion/core';
import execa from '../thirdparty-wrappers/execa';

export default async function ({projectRoot}) {
  const [huskyVersionDetails, huskyV4ConfigExists] = await Promise.all([
    await execa('npm', ['ls', 'husky', '--json']),
    await fileExists(`${projectRoot}/.huskyrc.json`)
  ]);

  const {dependencies} = JSON.parse(huskyVersionDetails);

  if (dependencies && semver.gte(dependencies.husky.version, '5.0.0') && huskyV4ConfigExists) {
    return {nextSteps: [{summary: 'Husky configuration is outdated for the installed Husky version'}]};
  }

  return {};
}
