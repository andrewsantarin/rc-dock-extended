import { createElement, Fragment } from 'react';
import { TabBase, TabData } from 'rc-dock';

/**
 * Generates a tab data object.
 *
 * @param {(TabData | TabBase)} [options] Additional tab data options
 * @returns A new tab data object
 */
export const createTabData = (options?: TabData | TabBase) => {
  const tabData: TabData = {
    title: '',
    content: createElement(Fragment),
    ...options,
  };
  return tabData;
};
