/**
 * Runs the provided `callback` after React's finishes rendering and painting the nodes (hopefully).
 * 
 * @see https://stackoverflow.com/a/34999925/11455106
 *
 * @param {FrameRequestCallback} callback The functon 
 * @param {number} [ms] (optional) Additional delays, where applicable.
 */
export const onNextFrame = (callback: FrameRequestCallback, ms?: number) => {
  setTimeout(() => {
    requestAnimationFrame(callback);
  }, ms);
};
