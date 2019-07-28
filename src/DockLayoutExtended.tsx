import React, { Component, createRef } from 'react';
import { AutoControlledManager, AutoControlled } from 'react-auto-controlled';
import { DockLayout, LayoutBase, LayoutData, TabData, PanelData } from 'rc-dock';
import { addTabToPanel } from 'rc-dock/lib/Algorithm';
import { loadLayoutData } from 'rc-dock/lib/Serializer';

// libs
import {
  createPropsGetter,
  createUuid,
  isNullOrUndefined,
  onNextFrame,
  safeInvoke,
  safeInvokeWithRef
} from './lib';

// utils
import { DockLayoutProps, Lookup, PanelElement } from './rc-dock-extended.types';
import { LAYOUT_TAB_DATA_SCHEMA_ID_PREFIX } from './rc-dock-extended.constants';
import { ACTIVE_DOCK_PANEL_CLASS_NAME } from './rc-dock-extended.constants';
import {
  createDataDockIdQuerySelector as data_dockid,
  createLayoutBase,
  createTabData,
  findFirstDeepestPanel,
  findFirstDeepestPanelWithTabs,
  findTabParentPanel,
  pickDataFromSchema,
  pickSchemaKeyFromTabId
} from './rc-dock-extended.utilities';


// #region Declared types and interfaces
export interface DockLayoutExtendedApi {
  /**
   * Adds a tab to a panel of a specific `id` using the `tabDataSchema` lookup key.
   *
   * @public
   * @param {string} schemaKey The schema lookup key of the tab to be added.
   * @param {string} panelId The `id` of the panel to add the tab to.
   * @returns {(string | undefined)} The `id` of the created tab, if it was created.
   */
  addTabDataToPanelIdBySchemaKey: (schemaKey: string, panelId: string) => (string | undefined);

  /**
   * Adds a tab to the active panel using lookup `tabDataSchema` lookup keys.
   *
   * @public
   * @param {string} schemaKey The schema lookup key of the tab to be added.
   * @returns {(string|undefined)} `tabId` — The ID of the created tab, if it was created.
   */
  addTabDataToActivePanelBySchemaKey: (schemaKey: string) => (string | undefined);

  /**
   * Sets the initial layout tree.
   *
   * @public
   * @param {LayoutBase} savedLayout The layout tree before passing them into the `<DockLayout>` component.
   */
  loadLayout: DockLayout['loadLayout'];

  /**
   * Generates the layout tree from the `<DockLayout>` component's state.
   * 
   * **Note**: This method does not persist the layout state when the browser tab is closed.
   *
   * @public
   * @returns {LayoutBase | undefined} The layout tree.
   */
  saveLayout: () => (LayoutBase | undefined);
}

export type DockLayoutExtendedDefaultProps = {
  /** Tab id string separator */
  tabIdSeparator: string;
  /** Tab render templates. */
  tabDataSchema: Lookup<TabData>;
  /** Tab id string generator. UUIDs/GUIDs are recommended. */
  createTabUuid: () => string;
};

export type DockLayoutExtendedProps = {}
  & Partial<DockLayoutExtendedDefaultProps>
  & Omit<DockLayoutProps, 'onLayoutChange' | 'defaultLayout' | 'layout'>
  & { // Introduce our own flavor of rc-dock's LayoutProps.
  /** Current active panel. */
  activePanelId?: string;
  /** Initial active panel. */
  defaultActivePanelId?: string;
  /** Current layout tree. */
  layout?: LayoutBase;
  /** Initial layout tree. */
  defaultLayout?: LayoutBase;

  /**
   * Callback to handle incoming data when the component's layout state changes.
   *
   * @param {LayoutBase} newLayout The next layout tree created from the change event.
   * @param {(string | null)} currentTabId The identifier of the tab affected by the change event (e.g. a drag n' drop).
   * @param {string} currentTabPanelId The identifier of the parent panel of the affected tab.
   */
  onLayoutChange?: (newLayout: LayoutBase, currentTabId: string | null, currentTabPanelId: string) => void;
  /**
   * Callback to handle incoming data when the component's layout state loads.
   *
   * @param {LayoutBase} layout The layout tree created from the load event.
   * @param {string} activePanelId The identifier of the currently active panel.
   */
  onLayoutLoad?: (layout: LayoutBase, activePanelId: string) => void;
};

export type DockLayoutExtendedState = Required<Pick<DockLayoutExtendedProps, 'activePanelId' | 'layout'>>;
// #endregion

// #region State manager
export const dockLayoutExtendedAutoControlledManager = new AutoControlledManager<DockLayoutExtendedState, DockLayoutExtendedProps>(
  [
    'activePanelId',
    'layout',
  ],
  {
    getInitialAutoControlledState() {
      return {
        activePanelId: '',
        layout: createLayoutBase(),
      };
    },
  }
);
// #endregion

// #region Default props
export const dockLayoutExtendedDefaultProps: Readonly<DockLayoutExtendedDefaultProps> = Object.freeze({
  tabIdSeparator: LAYOUT_TAB_DATA_SCHEMA_ID_PREFIX,
  tabDataSchema: {},
  createTabUuid: createUuid,
});

export const getDockLayoutExtendedProps = createPropsGetter(dockLayoutExtendedDefaultProps);
// #endregion

export class DockLayoutExtended
  extends Component<DockLayoutExtendedProps, DockLayoutExtendedState>
  implements AutoControlled<DockLayoutExtendedState>, DockLayoutExtendedApi {
  /** Reference to the `<DockLayout>` component API. */
  dockLayout = createRef<DockLayout>();

  static readonly defaultProps = dockLayoutExtendedDefaultProps;
  static readonly getDerivedStateFromProps = dockLayoutExtendedAutoControlledManager.getDerivedStateFromProps;

  state = dockLayoutExtendedAutoControlledManager.getInitialAutoControlledStateFromProps(this.props);
  trySetState = dockLayoutExtendedAutoControlledManager.trySetState;

  componentDidMount() {
    safeInvokeWithRef(this.dockLayout, (dockLayout) => {
      // TODO: Figure out how to make sure this works for tablets, too, using 'touchstart'. See rc-dock/lib/dragdrop/DragManager.ts.
      dockLayout._ref.addEventListener('mouseup', this.handleLayoutMouseDown);
    });
  }

  componentWillUnmount() {
    safeInvokeWithRef(this.dockLayout, (dockLayout) => {
      // TODO: Figure out how to make sure this works for tablets, too, using 'touchstart'. See rc-dock/lib/dragdrop/DragManager.ts.
      dockLayout._ref.removeEventListener('mouseup', this.handleLayoutMouseDown);
    });
  }

  // #region Tab insertion methods
  public addTabDataToPanelIdBySchemaKey: DockLayoutExtendedApi['addTabDataToPanelIdBySchemaKey'] = (schemaKey, panelId) => {
    return safeInvokeWithRef(this.dockLayout, (dockLayout) => {
      const panelData = dockLayout.find(panelId);
      const tabData = this.createTabData(schemaKey);

      dockLayout.dockMove(tabData, panelData, 'middle');

      return tabData.id;
    });
  }

  public addTabDataToActivePanelBySchemaKey: DockLayoutExtendedApi['addTabDataToActivePanelBySchemaKey'] = (schemaKey) => {
    if (this.state.activePanelId !== '') {
      return this.addTabDataToPanelIdBySchemaKey(schemaKey, this.state.activePanelId);
    } else {
      return this.addTabDataToFirstAvailablePanelBySchemaKey(schemaKey);
    }
  }

  private addTabDataToFirstAvailablePanelBySchemaKey = (schemaKey: string): (string | undefined) => {
    const { layout } = this.state;
    const panel = (
      findFirstDeepestPanel(layout.floatbox) ||
      findFirstDeepestPanel(layout.dockbox)
    );

    if (isNullOrUndefined(panel) || isNullOrUndefined(panel.id)) {
      return;
    }

    const { id: panelId } = panel;

    return safeInvokeWithRef(this.dockLayout, (dockLayout) => {
      const targetPanel = dockLayout.find(panelId) as PanelData;
      const dockLayoutProps = this.createDockLayoutProps(dockLayout, this.props);
      const currentLayout = DockLayout.loadLayoutData(layout, dockLayoutProps);
      const newTab = this.createTabData(schemaKey);
      const newLayout = addTabToPanel(currentLayout, newTab, targetPanel);

      // Explicitly update the state of the underlying `dockLayout` to generate the `LayoutBase` format.
      // The generated result will be consumed by this manager's `handleLayoutChange` function
      dockLayout.changeLayout(newLayout, newTab.id);

      return newTab.id;
    });
  }
  // #endregion

  // #region Layout creator helpers
  private createTabData = (schemaKey: string) => {
    const { tabIdSeparator, tabDataSchema, createTabUuid } = getDockLayoutExtendedProps(this.props);
    const tabUuid = createTabUuid();
    const tabData = createTabData(pickDataFromSchema(schemaKey, tabDataSchema));
    tabData.id = `${schemaKey}${tabIdSeparator}${tabUuid}`;

    return tabData as TabData & {
      id: string;
    };
  }

  private createDockLayoutProps = (dockLayout: DockLayout, props: DockLayoutExtendedProps): DockLayoutProps => {
    const { loadTab, afterPanelLoaded } = props;
    const defaultLayout = dockLayout.state.layout;
    const dockLayoutProps: DockLayoutProps = {
      afterPanelLoaded: afterPanelLoaded,
      defaultLayout: defaultLayout,
      loadTab: loadTab,
    };

    return dockLayoutProps;
  }
  // #endregion

  // #region Layout methods
  public loadLayout: DockLayoutExtendedApi['loadLayout'] = (savedLayout) => {
    safeInvokeWithRef(this.dockLayout, (dockLayout) => {
      dockLayout.loadLayout(savedLayout);
    });
  }

  public saveLayout: DockLayoutExtendedApi['saveLayout'] = () => {
    return safeInvokeWithRef(this.dockLayout, (dockLayout) => {
      return dockLayout.saveLayout();
    });
  }
  // #endregion

  // #region Layout default tab method overrides
  private doLoadTab: DockLayoutExtendedProps['loadTab'] = (tabBase) => {
    const { tabIdSeparator, tabDataSchema } = getDockLayoutExtendedProps(this.props);
    const tabKey = pickSchemaKeyFromTabId(tabBase.id, tabIdSeparator);
    const tabData = createTabData(pickDataFromSchema(tabKey, tabDataSchema));
    tabData.id = tabBase.id;

    return tabData;
  }

  private doSaveTab: DockLayoutExtendedProps['saveTab'];
  // #endregion

  // #region Layout event handlers
  private handleLayoutChange = (newLayout: LayoutBase, currentTabId: string | null) => {
    let activePanelId: string;

    // NOTE: As long as nobody uses `'+0'` as value of any panel id, this algorithm should generally be safe.
    if (this.mouseDownLastPanelId === this.state.activePanelId && isNullOrUndefined(currentTabId)) {
      this.mouseDownLastPanelId = '';
      activePanelId = this.state.activePanelId;
    } else if (currentTabId === null) {
      const maybeDeepestPanel = findFirstDeepestPanelWithTabs(newLayout);
      activePanelId = maybeDeepestPanel && maybeDeepestPanel.id ? maybeDeepestPanel.id : '';
    } else {
      const maybeDeepestPanel = findTabParentPanel(newLayout, currentTabId);
      activePanelId = maybeDeepestPanel && maybeDeepestPanel.id ? maybeDeepestPanel.id : this.state.activePanelId;
    }

    this.trySetState({
      layout: newLayout,
      activePanelId: activePanelId,
    });

    safeInvoke(this.props.onLayoutChange, newLayout, currentTabId, activePanelId);
  }

  // HACK: Memorize the `panel.id` of the last resize drag handle event so that will be the next `activePanelId`.
  private mouseDownLastPanelId: string = '';
  private handleLayoutMouseDown = (event: MouseEvent) => {
    safeInvokeWithRef(this.dockLayout, (dockLayout) => {
      let target = event.target;
      if (!target) {
        return;
      }

      if (target === dockLayout._ref) {
        return;
      }

      while ((target as Element).parentNode && !(target as PanelElement).dataset.dockid) {
        target = (target as Element).parentNode;
      }

      const panelElement = target as PanelElement;
      const panelId = panelElement.dataset.dockid;

      this.mouseDownLastPanelId = panelId || '';

      this.trySetState({
        activePanelId: panelId,
      });

      loadLayoutData(
        this.state.layout,
        {} as LayoutData,
        this.props.loadTab,
        this.handlePanelLoaded
      );

      safeInvoke(this.props.onLayoutChange, this.state.layout, null, this.state.activePanelId);
    });
  }

  private handlePanelLoaded: DockLayoutProps['afterPanelLoaded'] = (_savedPanel, loadedPanel) => {
    onNextFrame(() => {
      const panelElement = document.querySelector<PanelElement>(`[${data_dockid(loadedPanel.id)}]`);
      if (!panelElement) {
        return;
      }

      if (loadedPanel.id === this.state.activePanelId) {
        panelElement.classList.add(ACTIVE_DOCK_PANEL_CLASS_NAME);
      } else if (panelElement.classList.contains(ACTIVE_DOCK_PANEL_CLASS_NAME)) {
        panelElement.classList.remove(ACTIVE_DOCK_PANEL_CLASS_NAME);
      }
    });
  }

  private handlePanelSaved: DockLayoutProps['afterPanelSaved'];
  // #endregion

  render() {
    const { dropMode, groups, style } = this.props;
    const { layout } = this.state;
    const defaultLayout = undefined;

    return (
      <DockLayout
        ref={this.dockLayout}
        loadTab={this.doLoadTab}                  // TODO: Give users the freedom to specify their own.
        saveTab={this.doSaveTab}                  // TODO: Give users the freedom to specify their own.
        afterPanelSaved={this.handlePanelSaved}   // TODO: Give users the freedom to specify their own.
        afterPanelLoaded={this.handlePanelLoaded} // TODO: Give users the freedom to specify their own.
        dropMode={dropMode}
        groups={groups}
        layout={layout}
        defaultLayout={defaultLayout}
        onLayoutChange={this.handleLayoutChange}
        style={style}
      />
    );
  }
}
