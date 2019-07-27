import { LayoutBase } from 'rc-dock';

import { DEFAULT_LAYOUT } from '../rc-dock-extended.constants';


/**
 * Generates a layout base object.
 *
 * @param {LayoutBase} [options] Additional layout base options.
 *
 * @returns {LayoutBase} A new layout base object.
 */
export const createLayoutBase = (options?: LayoutBase): LayoutBase => {
  const layout: LayoutBase = {
    ...DEFAULT_LAYOUT,
    ...options,
  };

  return layout;
};
