import {info} from '@travi/cli-messages';
import liftScripts from './scripts';

export default async function ({results, projectRoot}) {
  info('Lifting JavaScript-specific details');

  await liftScripts({projectRoot, scripts: results.scripts});
}
