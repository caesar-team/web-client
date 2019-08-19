export const REMOVE_ITEM_REQUEST = '@item/REMOVE_ITEM_REQUEST';
export const REMOVE_ITEM_SUCCESS = '@item/REMOVE_ITEM_SUCCESS';
export const REMOVE_ITEM_FAILURE = '@item/REMOVE_ITEM_FAILURE';

export const REMOVE_ITEMS_BATCH_REQUEST = '@item/REMOVE_ITEMS_BATCH_REQUEST';
export const REMOVE_ITEMS_BATCH_SUCCESS = '@item/REMOVE_ITEMS_BATCH_SUCCESS';
export const REMOVE_ITEMS_BATCH_FAILURE = '@item/REMOVE_ITEMS_BATCH_FAILURE';

export const MOVE_ITEM_REQUEST = '@item/MOVE_ITEM_REQUEST';
export const MOVE_ITEM_SUCCESS = '@item/MOVE_ITEM_SUCCESS';
export const MOVE_ITEM_FAILURE = '@item/MOVE_ITEM_FAILURE';

export const MOVE_ITEMS_BATCH_REQUEST = '@item/MOVE_ITEMS_BATCH_REQUEST';
export const MOVE_ITEMS_BATCH_SUCCESS = '@item/MOVE_ITEMS_BATCH_SUCCESS';
export const MOVE_ITEMS_BATCH_FAILURE = '@item/MOVE_ITEMS_BATCH_FAILURE';

export const CREATE_ITEM_REQUEST = '@item/CREATE_ITEM_REQUEST';
export const CREATE_ITEM_SUCCESS = '@item/CREATE_ITEM_SUCCESS';
export const CREATE_ITEM_FAILURE = '@item/CREATE_ITEM_FAILURE';

export const CREATE_ITEMS_BATCH_REQUEST = '@item/CREATE_ITEMS_BATCH_REQUEST';
export const CREATE_ITEMS_BATCH_SUCCESS = '@item/CREATE_ITEMS_BATCH_SUCCESS';
export const CREATE_ITEMS_BATCH_FAILURE = '@item/CREATE_ITEMS_BATCH_FAILURE';

export const EDIT_ITEM_REQUEST = '@item/EDIT_ITEM_REQUEST';
export const EDIT_ITEM_SUCCESS = '@item/EDIT_ITEM_SUCCESS';
export const EDIT_ITEM_FAILURE = '@item/EDIT_ITEM_FAILURE';

export const ACCEPT_ITEM_UPDATE_REQUEST = '@item/ACCEPT_ITEM_UPDATE_REQUEST';
export const ACCEPT_ITEM_UPDATE_SUCCESS = '@item/ACCEPT_ITEM_UPDATE_SUCCESS';
export const ACCEPT_ITEM_UPDATE_FAILURE = '@item/ACCEPT_ITEM_UPDATE_FAILURE';

export const REJECT_ITEM_UPDATE_REQUEST = '@item/REJECT_ITEM_UPDATE_REQUEST';
export const REJECT_ITEM_UPDATE_SUCCESS = '@item/REJECT_ITEM_UPDATE_SUCCESS';
export const REJECT_ITEM_UPDATE_FAILURE = '@item/REJECT_ITEM_UPDATE_FAILURE';

export const TOGGLE_ITEM_TO_FAVORITE_REQUEST =
  '@item/TOGGLE_ITEM_TO_FAVORITE_REQUEST';
export const TOGGLE_ITEM_TO_FAVORITE_SUCCESS =
  '@item/TOGGLE_ITEM_TO_FAVORITE_SUCCESS';
export const TOGGLE_ITEM_TO_FAVORITE_FAILURE =
  '@item/TOGGLE_ITEM_TO_FAVORITE_FAILURE';

export const CREATE_ANONYMOUS_LINK_REQUEST =
  '@childItem/CREATE_ANONYMOUS_LINK_REQUEST';
export const CREATE_ANONYMOUS_LINK_SUCCESS =
  '@childItem/CREATE_ANONYMOUS_LINK_SUCCESS';
export const CREATE_ANONYMOUS_LINK_FAILURE =
  '@childItem/CREATE_ANONYMOUS_LINK_FAILURE';

export const REMOVE_ANONYMOUS_LINK_REQUEST =
  '@childItem/REMOVE_ANONYMOUS_LINK_REQUEST';
export const REMOVE_ANONYMOUS_LINK_SUCCESS =
  '@childItem/REMOVE_ANONYMOUS_LINK_SUCCESS';
export const REMOVE_ANONYMOUS_LINK_FAILURE =
  '@childItem/REMOVE_ANONYMOUS_LINK_FAILURE';

export const ADD_ITEMS_BATCH = '@item/ADD_ITEMS_BATCH';
export const REMOVE_ITEMS_BATCH = '@item/REMOVE_ITEMS_BATCH';
export const ADD_CHILD_ITEM_TO_ITEM = '@item/ADD_CHILD_ITEM_TO_ITEM';
export const ADD_CHILD_ITEMS_BATCH_TO_ITEM =
  '@item/ADD_CHILD_ITEMS_BATCH_TO_ITEM';
export const REMOVE_CHILD_ITEM_FROM_ITEM = '@item/REMOVE_CHILD_ITEM_FROM_ITEM';
export const REMOVE_CHILD_ITEMS_BATCH_FROM_ITEM =
  '@item/REMOVE_CHILD_ITEMS_BATCH_FROM_ITEM';

export const removeItemRequest = (itemId, listId) => ({
  type: REMOVE_ITEM_REQUEST,
  payload: {
    itemId,
    listId,
  },
});

export const removeItemSuccess = (itemId, listId) => ({
  type: REMOVE_ITEM_SUCCESS,
  payload: {
    itemId,
    listId,
  },
});

export const removeItemFailure = () => ({
  type: MOVE_ITEM_FAILURE,
});

export const removeItemsBatchRequest = listId => ({
  type: REMOVE_ITEMS_BATCH_REQUEST,
  payload: {
    listId,
  },
});

export const removeItemsBatchSuccess = (itemIds, listId) => ({
  type: REMOVE_ITEMS_BATCH_SUCCESS,
  payload: {
    itemIds,
    listId,
  },
});

export const removeItemsBatchFailure = () => ({
  type: REMOVE_ITEMS_BATCH_FAILURE,
});

export const moveItemRequest = listId => ({
  type: MOVE_ITEM_REQUEST,
  payload: {
    listId,
  },
});

export const moveItemSuccess = (itemId, oldListId, newListId) => ({
  type: MOVE_ITEM_SUCCESS,
  payload: {
    itemId,
    oldListId,
    newListId,
  },
});

export const moveItemFailure = () => ({
  type: MOVE_ITEM_FAILURE,
});

export const moveItemsBatchRequest = (oldListId, newListId) => ({
  type: MOVE_ITEMS_BATCH_REQUEST,
  payload: {
    oldListId,
    newListId,
  },
});

export const moveItemsBatchSuccess = (itemIds, oldListId, newListId) => ({
  type: MOVE_ITEMS_BATCH_SUCCESS,
  payload: {
    itemIds,
    oldListId,
    newListId,
  },
});

export const moveItemsBatchFailure = () => ({
  type: MOVE_ITEMS_BATCH_FAILURE,
});

export const createItemRequest = (item, setSubmitting) => ({
  type: CREATE_ITEM_REQUEST,
  payload: {
    item,
  },
  meta: {
    setSubmitting,
  },
});

export const createItemSuccess = item => ({
  type: CREATE_ITEM_SUCCESS,
  payload: {
    item,
  },
});

export const createItemFailure = () => ({
  type: CREATE_ITEM_FAILURE,
});

export const createItemsBatchRequest = (items, listId) => ({
  type: CREATE_ITEMS_BATCH_REQUEST,
  payload: {
    items,
    listId,
  },
});

export const createItemsBatchSuccess = items => ({
  type: CREATE_ITEMS_BATCH_SUCCESS,
  payload: {
    items,
  },
});

export const createItemsBatchFailure = () => ({
  type: CREATE_ITEMS_BATCH_FAILURE,
});

export const editItemRequest = (item, setSubmitting) => ({
  type: EDIT_ITEM_REQUEST,
  payload: {
    item,
  },
  meta: {
    setSubmitting,
  },
});

export const editItemSuccess = item => ({
  type: EDIT_ITEM_SUCCESS,
  payload: {
    item,
  },
});

export const editItemFailure = () => ({
  type: EDIT_ITEM_FAILURE,
});

export const acceptItemUpdateRequest = id => ({
  type: ACCEPT_ITEM_UPDATE_REQUEST,
  payload: {
    id,
  },
});

export const acceptItemUpdateSuccess = item => ({
  type: ACCEPT_ITEM_UPDATE_SUCCESS,
  payload: {
    item,
  },
});

export const acceptItemUpdateFailure = () => ({
  type: REJECT_ITEM_UPDATE_FAILURE,
});

export const rejectItemUpdateRequest = id => ({
  type: ACCEPT_ITEM_UPDATE_REQUEST,
  payload: {
    id,
  },
});

export const rejectItemUpdateSuccess = itemId => ({
  type: REJECT_ITEM_UPDATE_SUCCESS,
  payload: {
    itemId,
  },
});

export const rejectItemUpdateFailure = () => ({
  type: REJECT_ITEM_UPDATE_FAILURE,
});

export const toggleItemToFavoriteRequest = itemId => ({
  type: TOGGLE_ITEM_TO_FAVORITE_REQUEST,
  payload: {
    itemId,
  },
});

export const toggleItemToFavoriteSuccess = (
  itemId,
  favoritesListId,
  isFavorite,
) => ({
  type: TOGGLE_ITEM_TO_FAVORITE_SUCCESS,
  payload: {
    itemId,
    favoritesListId,
    isFavorite,
  },
});

export const toggleItemToFavoriteFailure = () => ({
  type: TOGGLE_ITEM_TO_FAVORITE_FAILURE,
});

export const createAnonymousLinkRequest = () => ({
  type: CREATE_ANONYMOUS_LINK_REQUEST,
});

export const createAnonymousLinkSuccess = (itemId, share) => ({
  type: CREATE_ANONYMOUS_LINK_SUCCESS,
  payload: {
    itemId,
    share,
  },
});

export const createAnonymousLinkFailure = () => ({
  type: CREATE_ANONYMOUS_LINK_FAILURE,
});

export const removeAnonymousLinkRequest = () => ({
  type: REMOVE_ANONYMOUS_LINK_REQUEST,
});

export const removeAnonymousLinkSuccess = itemId => ({
  type: REMOVE_ANONYMOUS_LINK_SUCCESS,
  payload: {
    itemId,
  },
});

export const removeAnonymousLinkFailure = () => ({
  type: REMOVE_ANONYMOUS_LINK_FAILURE,
});

export const addItemsBatch = itemsById => ({
  type: ADD_ITEMS_BATCH,
  payload: {
    itemsById,
  },
});

export const removeItemsBatch = itemIds => ({
  type: REMOVE_ITEMS_BATCH,
  payload: {
    itemIds,
  },
});

export const addChildItemToItem = (itemId, childItemId) => ({
  type: ADD_CHILD_ITEM_TO_ITEM,
  payload: {
    itemId,
    childItemId,
  },
});

export const addChildItemsBatchToItem = (itemIds, childItemIds) => ({
  type: ADD_CHILD_ITEMS_BATCH_TO_ITEM,
  payload: {
    itemIds,
    childItemIds,
  },
});

export const removeChildItemFromItem = (itemId, childItemId) => ({
  type: REMOVE_CHILD_ITEM_FROM_ITEM,
  payload: {
    itemId,
    childItemId,
  },
});

export const removeChildItemsBatchFromItem = (itemIds, childItemIds) => ({
  type: REMOVE_CHILD_ITEMS_BATCH_FROM_ITEM,
  payload: {
    itemIds,
    childItemIds,
  },
});
