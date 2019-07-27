import { BoxBase, LayoutBase, PanelBase } from 'rc-dock';

import { findFirstDeepestPanel } from './find-first-deepest-panel';


/**
 * (recursive) Searches the entire layout tree for the first deepest panel containing real tabs.
 * 
 * @param {BoxBase} [box] The layout box to search in.
 * 
 * @returns {(PanelBase | undefined)} The searched panel, if it exists.
 */
export const findFirstDeepestPanelWithTabsInBox = (box?: BoxBase): PanelBase | undefined => {
  if (!box) {
    return;
  }

  const deepestPanel = findFirstDeepestPanel(box);

  if (!deepestPanel) {
    return;
  }

  if (deepestPanel.tabs.length === 0) {
    return;
  }

  return deepestPanel;
};

/**
 * Searches the entire layout tree for the `id` of the first deepest panel containing real tabs.
 *
 * @param {LayoutBase} layout The dock & float component hierarchy.
 *
 * @returns {(PanelBase | undefined)} The searched panel, if it exists.
 */
export const findFirstDeepestPanelWithTabs = (layout: LayoutBase): PanelBase | undefined => {
  let result = findFirstDeepestPanelWithTabsInBox(layout.dockbox);
  if (!result && !!layout.floatbox) {
    result = findFirstDeepestPanelWithTabsInBox(layout.floatbox);
  }
  return result;
};
