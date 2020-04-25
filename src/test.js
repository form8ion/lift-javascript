import {promises as fs} from 'fs';

export default async function ({projectRoot}) {
  try {
    const stats = await fs.stat(`${projectRoot}/.nvmrc`);

    return stats.isFile();
  } catch (e) {
    if ('ENOENT' === e.code) return false;

    throw e;
  }
}
