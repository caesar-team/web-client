import { createSelector } from 'reselect';
import { childItemsByIdSelector } from '@caesar/common/selectors/entities/childItem';
import { currentTeamSelector } from '@caesar/common/selectors/user';
import { generateSystemItemName } from '@caesar/common/utils/item';
import { ENTITY_TYPE, ITEM_TYPE } from '@caesar/common/constants';

export const entitiesSelector = state => state.entities;

export const itemEntitySelector = createSelector(
  entitiesSelector,
  entities => entities.item,
);

export const itemsByIdSelector = createSelector(
  itemEntitySelector,
  itemEntity => itemEntity.byId,
);

export const itemListSelector = createSelector(
  itemsByIdSelector,
  byId => Object.values(byId) || [],
);

const itemIdPropSelector = (_, props) => props.itemId;

export const itemSelector = createSelector(
  itemsByIdSelector,
  itemIdPropSelector,
  (itemsById, itemId) => itemsById[itemId] || null,
);

const itemIdsPropSelector = (_, props) => props.itemIds;

export const itemsBatchSelector = createSelector(
  itemsByIdSelector,
  itemIdsPropSelector,
  (itemsById, itemIds) => itemIds.map(itemId => itemsById[itemId] || {}),
);

const teamIdPropSelector = (_, prop) => prop.teamId;

export const teamItemListSelector = createSelector(
  itemListSelector,
  teamIdPropSelector,
  (itemList, teamId) => itemList.filter(item => item.teamId === teamId),
);

export const itemChildItemsSelector = createSelector(
  itemSelector,
  childItemsByIdSelector,
  (item, childItemsById) =>
    item.invited.map(childItemId => childItemsById[childItemId]),
);

export const itemsChildItemsBatchSelector = createSelector(
  itemsByIdSelector,
  itemIdsPropSelector,
  childItemsByIdSelector,
  (itemsById, itemIds, childItemsById) => {
    return itemIds.reduce((accumulator, itemId) => {
      return [
        ...accumulator,
        ...itemsById[itemId].invited.map(
          childItemId => childItemsById[childItemId],
        ),
      ];
    }, []);
  },
);

export const systemItemsSelector = createSelector(
  itemsByIdSelector,
  items =>
    Object.values(items).filter(({ type }) => type === ITEM_TYPE.SYSTEM) || [],
);

export const systemItemsBatchSelector = createSelector(
  systemItemsSelector,
  itemIdsPropSelector,
  (systemItems, itemIds) =>
    itemIds.map(itemId => {
      //        console.log(systemItems);
      //       console.log(itemId);
      return (
        systemItems.find(
          ({ data }) =>
            data.name === generateSystemItemName(ENTITY_TYPE.ITEM, itemId),
        ) || {}
      );
    }),
);

export const teamSystemItemSelector = createSelector(
  systemItemsSelector,
  currentTeamSelector,
  (items, currentTeam) =>
    items.find(
      ({ data }) =>
        data.name === generateSystemItemName(ENTITY_TYPE.TEAM, currentTeam.id),
    ) || {},
);

export const visibleItemsSelector = createSelector(
  itemsBatchSelector,
  items => items.filter(({ type }) => type !== ITEM_TYPE.SYSTEM) || [],
);

export const ownItemsSelector = createSelector();
