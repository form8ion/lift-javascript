import deepmerge from 'deepmerge';
import {info} from '@travi/cli-messages';

export default async function ({results, enhancers = {}, projectRoot}) {
  info('Applying Enhancers');

  return Object.values(enhancers)
    .reduce(async (acc, enhancer) => {
      if (await enhancer.test({projectRoot})) {
        const previousResults = await acc;

        return deepmerge(
          previousResults,
          await enhancer.lift({results: previousResults, projectRoot})
        );
      }

      return acc;
    }, results);
}
