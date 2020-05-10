import {promises as fs} from 'fs';
import {info} from '@travi/cli-messages';

export default async function ({projectRoot, scripts, tags}) {
  if (scripts || tags) {
    info('Updating `package.json`', {level: 'secondary'});

    const pathToPackageJson = `${projectRoot}/package.json`;

    const existingPackageJsonContents = JSON.parse(await fs.readFile(pathToPackageJson, 'utf8'));

    await fs.writeFile(
      pathToPackageJson,
      JSON.stringify(
        {
          ...existingPackageJsonContents,
          scripts: {...existingPackageJsonContents.scripts, ...scripts},
          keywords: existingPackageJsonContents.keywords ? [...existingPackageJsonContents.keywords, ...tags] : tags
        },
        null,
        2
      )
    );
  }
}
