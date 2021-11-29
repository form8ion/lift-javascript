import {lift as liftHusky, test as liftPredicate} from '@form8ion/husky';

export function enhanceHuskyEnhancer(packageManager) {
  return {
    test: liftPredicate,
    lift: ({projectRoot, results}) => liftHusky({projectRoot, results, packageManager})
  };
}
