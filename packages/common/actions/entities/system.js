export const ADD_SYSTEM_ITEMS_BATCH = '@system/ADD_SYSTEM_ITEMS_BATCH';
export const REMOVE_SYSTEM_ITEM = '@system/REMOVE_SYSTEM_ITEM';

export const addSystemItemsBatch = items => ({
  type: ADD_SYSTEM_ITEMS_BATCH,
  payload: {
    items,
  },
});

export const removeSystemItem = itemId => ({
  type: REMOVE_SYSTEM_ITEM,
  payload: {
    itemId,
  },
});