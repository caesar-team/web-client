import { createSelector } from 'reselect';
import {
  listsByIdSelector,
  extendedSortedCustomizableListsSelector,
} from 'common/selectors/entities/list';
import { itemsByIdSelector } from 'common/selectors/entities/item';
import { childItemsByIdSelector } from 'common/selectors/entities/childItem';
import { membersByIdSelector } from 'common/selectors/entities/member';

export const workflowSelector = state => state.workflow;

export const isLoadingSelector = createSelector(
  workflowSelector,
  workflow => workflow.isLoading,
);

export const isErrorSelector = createSelector(
  workflowSelector,
  workflow => workflow.isError,
);

export const workInProgressItemSelector = createSelector(
  workflowSelector,
  workflow => workflow.workInProgressItem,
);

export const workInProgressItemOwnerSelector = createSelector(
  workInProgressItemSelector,
  membersByIdSelector,
  (workInProgressItem, membersById) =>
    workInProgressItem && Object.values(membersById).length
      ? membersById[workInProgressItem.ownerId]
      : null,
);

export const workInProgressItemChildItemsSelector = createSelector(
  workInProgressItemSelector,
  childItemsByIdSelector,
  (workInProgressItem, childItemsById) =>
    workInProgressItem && Object.values(childItemsById).length
      ? workInProgressItem.invited.map(id => childItemsById[id])
      : [],
);

const constructedWorkInProgressItem = createSelector(
  workInProgressItemSelector,
  workInProgressItemOwnerSelector,
  workInProgressItemChildItemsSelector,
  (
    workInProgressItem,
    workInProgressItemOwner,
    workInProgressItemChildItems,
  ) => ({
    ...workInProgressItem,
    owner: workInProgressItemOwner,
    invited: workInProgressItemChildItems,
  }),
);

export const workInProgressListIdSelector = createSelector(
  workflowSelector,
  workflow => workflow.workInProgressListId,
);

export const workInProgressItemIdsSelector = createSelector(
  workflowSelector,
  workflow => workflow.workInProgressItemIds,
);

export const workInProgressListSelector = createSelector(
  listsByIdSelector,
  workInProgressListIdSelector,
  (listsById, workInProgressListId) => listsById[workInProgressListId],
);

export const workInProgressItemsSelector = createSelector(
  itemsByIdSelector,
  workInProgressItemIdsSelector,
  (itemsById, workInProgressItemIds) =>
    workInProgressItemIds.map(itemId => itemsById[itemId]),
);

export const shouldLoadNodesSelector = createSelector(
  extendedSortedCustomizableListsSelector,
  lists => !lists.length,
);

export const visibleListItemsSelector = createSelector(
  listsByIdSelector,
  itemsByIdSelector,
  workInProgressListIdSelector,
  (listsById, itemsById, workInProgressListId) =>
    listsById && workInProgressListId && listsById[workInProgressListId]
      ? listsById[workInProgressListId].children.reduce(
          (accumulator, itemId) =>
            itemsById[itemId] && itemsById[itemId].data
              ? accumulator.concat(itemsById[itemId])
              : accumulator,
          [],
        )
      : [],
);
