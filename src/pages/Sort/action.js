export const actionSortRest = data => ({
  type: 'SORT_RESET',
  ...data,
});
export const actionSortSwap = data => ({
  type: 'SORT_SWAP',
  ...data,
});
export const actionSortActivate = data => ({
  type: 'SORT_ACTIVATE',
  ...data,
});
export const actionSortDeactivate = data => ({
  type: 'SORT_DEACTIVATE',
  ...data,
});
export const actionSortLock = data => ({
  type: 'SORT_LOCK',
  ...data,
});
export const actionSortDone = () => ({
  type: 'SORT_DONE',
});
