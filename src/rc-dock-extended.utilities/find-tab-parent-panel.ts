import { PanelBase, BoxBase, LayoutBase } from 'rc-dock';


// Patterned from rc-dock/src/Algorithm
/**
 * Searches a given panel for a tab whose parent is the given panel.
 *
 * @param {PanelBase} panel The given panel.
 * @param {string} tabId The id of the tab to search for.
 *
 * @returns {(PanelBase | undefined)} The given panel, if found, else `undefined`.
 */
const findParentPanelFromTab = (panel: PanelBase, tabId: string): PanelBase | undefined => {
  for (const tab of panel.tabs) {
    if (tab.id === tabId) {
      return panel;
    }
  }
  return undefined;
};

/**
 * (recursive) Searches the entire layout box for the parent panel of a tab node.
 *
 * @param {BoxBase} box The layout box to search in.
 * @param {string} tabId The id of the tab to search for.
 *
 * @returns {(PanelBase | undefined)} The tab node's parent, if found, else `undefined`.
 */
export const findTabParentPanelInBox = (box: BoxBase, tabId: string): PanelBase | undefined => {
  let result;
  for (const child of box.children) {
    if ('children' in child) {
      result = findTabParentPanelInBox(child, tabId);
      if (result) {
        break;
      }
    } else if ('tabs' in child) {
      result = findParentPanelFromTab(child, tabId);
      if (result) {
        break;
      }
    }
  }
  return result;
};

/**
 * Searches the entire layout tree for the parent panel of a tab node.
 *
 * @param {LayoutBase} layout The dock & float component hierarchy
 * @param {string} tabId The id of the tab to search for
 *
 * @returns {(PanelBase | undefined)} The parent panel of a tab node, if it exists
 */
export const findTabParentPanel = (layout: LayoutBase, tabId: string): PanelBase | undefined => {
  let result = findTabParentPanelInBox(layout.dockbox, tabId);
  if (!result && !!layout.floatbox) {
    result = findTabParentPanelInBox(layout.floatbox, tabId);
  }
  return result;
};
