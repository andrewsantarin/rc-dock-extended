import React, { FunctionComponent } from 'react';

export const KEY: string = 'FIRST';

export type FirstTestComponentProps = {
  tabId?: string;
};

export const FirstTestComponent: FunctionComponent<FirstTestComponentProps> = ({ tabId }) => {
  return (
    <div>
      <div>First template content:</div>
      {tabId}
    </div>
  );
};
