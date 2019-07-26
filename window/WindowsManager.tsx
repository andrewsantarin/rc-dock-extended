// import React, { Component, PureComponent, Fragment } from 'react';
// import DockTabPane, { getContextPaneClass } from 'rc-dock/lib/DockTabPane';
// import NewWindow from 'react-new-window';
// import { AutoControlledManager } from 'react-auto-controlled';
// import isFunction from 'lodash/isFunction';

// import { WindowTabBaseLookup, WindowTabDataLookup, WindowTabData, DockTabPaneCached, DockTabPaneProps } from './rc-dock-extended.types';


// export const WindowTab = () => <div />;
// export const WindowContent = ({ windowData }: { windowData: WindowTabData }) => {
//   let { id, title, closable, cached, content, cacheContext } = windowData;
//   const tab = <WindowTab />;

//   if (isFunction(content)) {
//     content = content(windowData);
//   }

//   if (cacheContext) {
//     const DockTabPaneClass = getContextPaneClass(cacheContext) as typeof DockTabPaneCached;

//     return (
//       <DockTabPaneClass
//         key={id}
//         id={id}
//         cached={!!cached}
//         tab={tab}
//       >
//         {content}
//       </DockTabPaneClass>
//     );
//   } else {
//     return (
//       <DockTabPane
//         key={id}
//         id={id}
//         cached={!!cached}
//         tab={tab}
//       >
//         {content}
//       </DockTabPane>
//     );
//   }
// };

// export type WindowsManagerProps = {
//   windows?: WindowTabBaseLookup;
// };

// export type WindowsManagerState = {
//   windows: WindowTabDataLookup;
// };

// export class WindowsManager extends Component<WindowsManagerProps, WindowsManagerState> {
//   render() {
//     const { windows } = this.state;
//     const windowKeys = Object.keys(windows);

//     return (
//       <Fragment>
//         {windowKeys.map((windowKey) => (
//           <NewWindow
//             key={windowKey}
//             title={windowKey.constructor.tabTitle as any as string}
//           >
//             {WindowContent({
//               windowData: windows[windowKey],
//             })}
//           </NewWindow>
//         ))}
//       </Fragment>
//     );
//   }
// }
