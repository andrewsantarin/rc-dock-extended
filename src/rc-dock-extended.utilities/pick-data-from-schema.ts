import { TabData } from 'rc-dock';

import { isNullOrUndefined } from '../lib';
import { Lookup } from '../rc-dock-extended.types';


export const pickDataFromSchema = (key: string, schema?: Lookup<TabData>) => {
  if (isNullOrUndefined(schema) || isNullOrUndefined(schema[key])) {
    return;
  }

  return schema[key];
};
