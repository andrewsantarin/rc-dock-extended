import { LayoutBase } from 'rc-dock';


/**
 * Built-in `rc-dock` prefix for box & panel layout nodes.
 */
export const LAYOUT_ID_PREFIX = '+';

/**
 * Built-in `rc-dock-extended` prefix for tab layout `content` nodes.
 */
export const LAYOUT_TAB_DATA_SCHEMA_ID_PREFIX = '#';

export const DEFAULT_LAYOUT: Readonly<LayoutBase> = Object.freeze({
  dockbox: {
    id: `${LAYOUT_ID_PREFIX}${1}`,
    mode: 'horizontal',
    children: [
      {
        id: `${LAYOUT_ID_PREFIX}${0}`,
        tabs: [
        ],
      },
    ],
  },
  floatbox: {
    id: `${LAYOUT_ID_PREFIX}${2}`,
    mode: 'float',
    children: [
    ],
  },
});

export const ACTIVE_DOCK_PANEL_CLASS_NAME = 'dock-panel--active';
