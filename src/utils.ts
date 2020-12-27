export const exhaustCheck = (_: never): never => {
  throw new Error('not exhaustive');
};
