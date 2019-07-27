import { BoxBase, PanelBase } from 'rc-dock';

import { isNullOrUndefined } from '../lib';


/**
 * (recursive) Searches the entire layout tree for the first deepest panel occurrence.
 *
 * @param {BoxBase} [box] The layout box to search in.
 *
 * @returns {(PanelBase | undefined)} The first deepest panel occurrence, if it exists.
 */
export const findFirstDeepestPanel = (box?: BoxBase): PanelBase | undefined => {
  if (isNullOrUndefined(box)) {
    return;
  }

  let result;

  for (const child of box.children) {
    if ('children' in child) {
      result = findFirstDeepestPanel(child);
      if (result) {
        break;
      }
    } else {
      result = child;
    }
  }

  return result;
};
