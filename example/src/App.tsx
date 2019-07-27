import React, { CSSProperties, FunctionComponent, useRef } from 'react';

import 'rc-dock/dist/rc-dock.css';

import { TabData, TabGroup, PanelData, DockContext, LayoutBase } from 'rc-dock';
import { DockLayoutExtended, Lookup, LAYOUT_ID_PREFIX, LAYOUT_TAB_DATA_SCHEMA_ID_PREFIX } from 'rc-dock-extended';

import './App.css';

import { FirstTestComponent, KEY as FIRST } from './components/FirstTestComponent';
import { SecondTestComponent, KEY as SECOND } from './components/SecondTestComponent';

const handleClosePanelButtonClick = (panelData: PanelData, dockContext: DockContext) => () => {
  dockContext.dockMove(panelData, null as any, 'remove');
};

const tabDataSchema: Lookup<TabData> = {
  [FIRST]: {
    title: 'First',
    group: 'testGroup',
    content: (tabData) => {
      return (
        <FirstTestComponent tabId={tabData.id} />
      );
    },
  },
  [SECOND]: {
    title: 'Second',
    group: 'testGroup',
    content: (tabData) => {
      return (
        <SecondTestComponent tabId={tabData.id} />
      );
    },
  },
};

const tabGroupSchema: Lookup<TabGroup> = {
  testGroup: {
    floatable: true,
    panelExtra: (panelData, dockContext) => {
      return (
        <div>
          Panel {panelData.id}
          <button onClick={handleClosePanelButtonClick(panelData, dockContext)}>
            X
          </button>
        </div>
      );
    },
  },
};

const intiialActivePanel: string = `${LAYOUT_ID_PREFIX}${4}`;

const initialLayout: LayoutBase = {
  dockbox: {
    id: `${LAYOUT_ID_PREFIX}${1}`,
    mode: 'horizontal',
    children: [
      {
        id: `${LAYOUT_ID_PREFIX}${3}`,
        activeId: `${FIRST}${LAYOUT_TAB_DATA_SCHEMA_ID_PREFIX}${2}`, // 'FIRST#2'
        tabs: [
          {
            id: `${SECOND}${LAYOUT_TAB_DATA_SCHEMA_ID_PREFIX}${1}`, // 'SECOND#1'
          },
          {
            id: `${FIRST}${LAYOUT_TAB_DATA_SCHEMA_ID_PREFIX}${2}`, // 'FIRST#2'
          },
          {
            id: `${FIRST}${LAYOUT_TAB_DATA_SCHEMA_ID_PREFIX}${3}`, // 'FIRST#3'
          },
          {
            id: `${FIRST}${LAYOUT_TAB_DATA_SCHEMA_ID_PREFIX}${4}`, // 'FIRST#4'
          },
          {
            id: `${SECOND}${LAYOUT_TAB_DATA_SCHEMA_ID_PREFIX}${5}`, // 'SECOND#5'
          },
        ],
      },
    ],
  },
  floatbox: {
    id: `${LAYOUT_ID_PREFIX}${2}`,
    mode: 'float',
    size: 200,
    children: [
      {
        id: `${LAYOUT_ID_PREFIX}${4}`,
        size: 200,
        tabs: [
          {
            id: `${SECOND}${LAYOUT_TAB_DATA_SCHEMA_ID_PREFIX}${6}`, // 'SECOND#6'
          },
        ],
        activeId: `${SECOND}${LAYOUT_TAB_DATA_SCHEMA_ID_PREFIX}${6}`,
        x: 190,
        y: 164,
        z: 1,
        w: 300,
        h: 300,
      },
      {
        id: `${LAYOUT_ID_PREFIX}${5}`,
        size: 200,
        tabs: [
          {
            id: `${FIRST}${LAYOUT_TAB_DATA_SCHEMA_ID_PREFIX}${7}`, // 'FIRST#7'
          },
        ],
        activeId: `${FIRST}${LAYOUT_TAB_DATA_SCHEMA_ID_PREFIX}${7}`,
        x: 40,
        y: 16,
        z: 1,
        w: 300,
        h: 300,
      },
    ],
  },
};

const App: FunctionComponent = () => {
  const dockLayout = useRef<DockLayoutExtended>(null);

  const appStyle: CSSProperties = {
    display: 'block',
    height: '100%',
  };

  const layoutStyle: CSSProperties = {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
  };

  return (
    <div className="app" style={appStyle}>
      <DockLayoutExtended
        ref={dockLayout}
        groups={tabGroupSchema}
        tabDataSchema={tabDataSchema}
        style={layoutStyle}
        defaultActivePanelId={intiialActivePanel}
        defaultLayout={initialLayout}
      />
    </div>
  );
};

// tslint:disable-next-line: no-default-export
export default App;
