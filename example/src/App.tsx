import React, { CSSProperties, FunctionComponent } from 'react';

import 'rc-dock/dist/rc-dock.css';

import { TabData, TabGroup } from 'rc-dock';
import { DockLayoutExtended, Lookup, LAYOUT_ID_PREFIX, LAYOUT_TAB_DATA_SCHEMA_ID_PREFIX } from 'rc-dock-extended';

import './App.css';

import { FirstTestComponent, KEY as FIRST } from './components/FirstTestComponent';
import { SecondTestComponent, KEY as SECOND } from './components/SecondTestComponent';

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
        </div>
      );
    },
  },
};

const App: FunctionComponent = () => {
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
        groups={tabGroupSchema}
        tabDataSchema={tabDataSchema}
        style={layoutStyle}
        defaultActivePanelId={`${LAYOUT_ID_PREFIX}${0}`}
        defaultLayout={{
          dockbox: {
            id: `${LAYOUT_ID_PREFIX}${1}`,
            mode: 'horizontal',
            children: [
              {
                id: `${LAYOUT_ID_PREFIX}${0}`,
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
            children: [
            ],
          },
        }}
      />
    </div>
  );
};

// tslint:disable-next-line: no-default-export
export default App;
