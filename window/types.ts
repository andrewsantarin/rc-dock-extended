import { ComponentProps } from 'react';
import DockLayout, { TabBase, TabData } from 'rc-dock';
// import { ComponentProps, Context } from 'react';
// import DockLayout, { TabBase, TabData, TabGroup, LayoutBase, LayoutData, PanelBase } from 'rc-dock';
// import DockTabPane from 'rc-dock/lib/DockTabPane';

export type TabDataOptions = {}
  & TabBase
  & Pick<TabData, 'group' | 'parent' | 'closable' | 'cached' | 'cacheContext' | 'minWidth' | 'minHeight'>;

export type Lookup<Value> = {
  [key: string]: Value;
};

// Inferred from <DockLayout> since the LayoutProps interface isn't exported.
export type DockLayoutProps = ComponentProps<typeof DockLayout>;

// #region multiple windows
// // Inferred from getContextPaneClass(contextType).
// // Creates a component to cache if panel hasn't been cached yet.
// export type DockTabPaneProps = ComponentProps<typeof DockTabPane>;
// export declare class DockTabPaneCached extends DockTabPane {
//   constructor(props: DockTabPaneProps);
//   static contextType: Context<any>;
//   _context: any;
//   updateCache(): void;
// }

// // Extended scopes
// export type TabDataSchema = Lookup<TabData>;
// export type TabGroupScema = Lookup<TabGroup>;

// export type WithParentPanel<WindowTabType extends {}> = WindowTabType & {
//   parent?: Pick<PanelBase, 'id' | 'h' | 'w' | 'x' | 'y'>;
// };

// export type WindowTabBase = WithParentPanel<TabBase>;
// export type WindowTabBaseLookup = Lookup<WindowTabBase>;

// export type WindowTabData = WithParentPanel<Omit<TabData, 'parent'>>;
// export type WindowTabDataLookup = Lookup<WindowTabData>;

// export type LayoutBaseExtended = LayoutBase & {
//   windows?: WindowTabBaseLookup;
// };

// export type LayoutDataExtended = LayoutData & {
//   windows?: WindowTabDataLookup;
// };
// #endregion
