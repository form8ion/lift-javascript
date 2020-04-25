import {promises as fs} from 'fs';

export default async function ({projectRoot, scripts}) {
  if (scripts) {
    const pathToPackageJson = `${projectRoot}/package.json`;

    const existingPackageJsonContents = JSON.parse(await fs.readFile(pathToPackageJson, 'utf8'));

    await fs.writeFile(
      pathToPackageJson,
      JSON.stringify({...existingPackageJsonContents, scripts: {...existingPackageJsonContents.scripts, ...scripts}})
    );
  }
}
