import {info} from '@travi/cli-messages';
import liftScripts from './package';

export default async function ({results: {scripts, tags}, projectRoot}) {
  info('Lifting JavaScript-specific details');

  await liftScripts({projectRoot, scripts, tags});
}
