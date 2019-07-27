import { TabData } from 'rc-dock';

import { isNullOrUndefined } from '../lib';
import { Lookup } from '../rc-dock-extended.types';


/**
 * Selects a tab data from a tab data schema lookup using a reference key.
 * 
 * @param {string} key The reference key to a certain tab data.
 * @param {Lookup<TabData>} [schema] (optional) A lookup containing tab data.
 * 
 * @returns {(TabData | undefined)} The tab data referred to by the key, if it exists.
 */
export const pickDataFromSchema = (key: string, schema?: Lookup<TabData>): TabData | undefined => {
  if (isNullOrUndefined(schema) || isNullOrUndefined(schema[key])) {
    return;
  }

  return schema[key];
};
