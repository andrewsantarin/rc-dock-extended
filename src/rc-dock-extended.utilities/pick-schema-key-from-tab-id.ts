/**
 * Select the schema `key` segment from a tab `id` sequence.
 * 
 * @param {string} [id] (optional) A box identifier. If omitted, the function generates an empty string.
 * @param {string} [idKeyDelimiter] (optional) A character which separates the key and id.
 * 
 * @returns {string} The schema key.
 */
export const pickSchemaKeyFromTabId = (
  id: string = '',
  delimiter: string = ''
): string => {
  // Key is on the left-hand side of the `id` string.
  //
  // e.g. MY_DATA_TABLE#12345678
  // key = MY_DATA_TABLE
  // id  = 12345678
  const [ key ] = id.split(delimiter);

  return key;
};
