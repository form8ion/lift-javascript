import liftScripts from './scripts';

export default async function ({results, projectRoot}) {
  await liftScripts({projectRoot, scripts: results.scripts});
}
