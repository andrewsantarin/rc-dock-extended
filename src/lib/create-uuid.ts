// Patterned from golden-layout, shamelessly copied
export const createUuid = () => (Math.random() * 1000000000000000)
  .toString(36)
  .replace('.', '');
