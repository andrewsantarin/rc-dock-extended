/**
 * Creates a `dockid` data attribute query selector string.
 *
 * @param {string} [id] (optional) The `dockid` value.
 * @returns {string} The templated `dockid` data attribute.
 */
export const createDataDockIdQuerySelector = (id?: string): string => {
  const attrName = 'data-dockid';

  if (typeof id === 'string') {
    return `${attrName}="${id}"`;
  }

  return attrName;
};
