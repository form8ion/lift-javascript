import semver from 'semver';
import {warn} from '@travi/cli-messages';
import {fileExists} from '@form8ion/core';
import execa from '../thirdparty-wrappers/execa';

export default async function ({projectRoot}) {
  const huskyV4ConfigExists = await fileExists(`${projectRoot}/.huskyrc.json`);

  try {
    const {stdout: huskyVersionDetails} = await execa('npm', ['ls', 'husky', '--json']);

    const {dependencies} = JSON.parse(huskyVersionDetails);

    if (semver.gte(dependencies.husky.version, '5.0.0') && huskyV4ConfigExists) {
      return {nextSteps: [{summary: 'Husky configuration is outdated for the installed Husky version'}]};
    }

    return {};
  } catch (e) {
    if ('npm ls husky --json' === e.command) {
      warn('Husky is not currently installed as a dependency');

      return {};
    }

    throw e;
  }
}
