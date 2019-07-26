import { ComponentProps } from 'react';
import DockLayout, { TabBase, TabData } from 'rc-dock';

export type PanelElement = HTMLDivElement & HTMLOrSVGElement & {
  dataset: HTMLOrSVGElement['dataset'] & {
    dockid: string | undefined;
  };
};

export type TabDataOptions = {}
  & TabBase
  & Pick<TabData, 'group' | 'parent' | 'closable' | 'cached' | 'cacheContext' | 'minWidth' | 'minHeight'>;

export type Lookup<Value> = {
  [key: string]: Value;
};

// Inferred from <DockLayout> since the LayoutProps interface isn't exported.
export type DockLayoutProps = ComponentProps<typeof DockLayout>;
