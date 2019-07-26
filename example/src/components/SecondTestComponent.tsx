import React, { FunctionComponent } from 'react';

export const KEY: string = 'SECOND';

export type SecondTestComponentProps = {
  tabId?: string;
};

export const SecondTestComponent: FunctionComponent<SecondTestComponentProps> = ({ tabId }) => {
  return (
    <div>
      <div>Second template content:</div>
      {tabId}
    </div>
  );
};
