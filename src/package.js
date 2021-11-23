import {promises as fs} from 'fs';
import {info} from '@travi/cli-messages';
import {DEV_DEPENDENCY_TYPE, installDependencies, PROD_DEPENDENCY_TYPE} from '@form8ion/javascript-core';

export default async function ({
  projectRoot,
  scripts,
  tags,
  dependencies,
  devDependencies,
  packageManager
}) {
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
          ...tags && {
            keywords: existingPackageJsonContents.keywords ? [...existingPackageJsonContents.keywords, ...tags] : tags
          }
        },
        null,
        2
      )
    );
  }

  info('Installing dependencies');

  await installDependencies(dependencies || [], PROD_DEPENDENCY_TYPE, projectRoot, packageManager);
  await installDependencies([...devDependencies || []], DEV_DEPENDENCY_TYPE, projectRoot, packageManager);
}
