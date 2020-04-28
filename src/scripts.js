import {promises as fs} from 'fs';
import {info} from '@travi/cli-messages';

export default async function ({projectRoot, scripts}) {
  if (scripts) {
    info('Adding npm scripts to `package.json`', {level: 'secondary'});

    const pathToPackageJson = `${projectRoot}/package.json`;

    const existingPackageJsonContents = JSON.parse(await fs.readFile(pathToPackageJson, 'utf8'));

    await fs.writeFile(
      pathToPackageJson,
      JSON.stringify(
        {...existingPackageJsonContents, scripts: {...existingPackageJsonContents.scripts, ...scripts}},
        null,
        2
      )
    );
  }
}
