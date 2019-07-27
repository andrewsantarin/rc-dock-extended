import { TabData } from 'rc-dock';

import { Lookup, TabDataOptions } from '../rc-dock-extended.types';


/**
 * Enhance tab data schema with additional generic attribute options.
 *
 * @param {Lookup<TabData>} tabDataSchema Tab data lookup schema.
 * @param {TabDataOptions} options Attributes to apply to all tab base objects.
 *
 * @returns {Lookup<TabData>} A new tab data schema object with the additional attributes.
 */
export const enhanceTabDataSchema = (
  tabDataSchema: Lookup<TabData>,
  options: TabDataOptions
): Lookup<TabData> => {
  return Object.keys(tabDataSchema).reduce((lookup: Lookup<TabData>, key: string) => {
    const tabData: TabData = {
      ...tabDataSchema[key],
      ...options,
    };
    lookup[key] = tabData;
    return lookup;
  }, {} as Lookup<TabData>);
};
