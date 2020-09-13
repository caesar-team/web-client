import { normalize } from 'normalizr';
import { ITEM_TYPE, LIST_TYPE } from '@caesar/common/constants';
import { listSchema, memberSchema, teamSchema, itemSchema } from './schemas';

export const extractRelatedAndNonSystemItems = lists => {
  const result = lists.map(({ children, type, ...rest }) => {
    const relatedItems =
      type === LIST_TYPE.INBOX
        ? children
            .filter(item => item && item.relatedItem)
            .map(item => item.relatedItem)
        : [];
    const nonSystemChildren = children.filter(
      item => item?.type !== ITEM_TYPE.SYSTEM,
    );

    return {
      ...rest,
      type,
      children: [...nonSystemChildren, ...relatedItems],
    };
  });

  return result;
};

export const convertItemsToEntities = items => {
  const normalized = normalize(items, [itemSchema]);

  return {
    itemsById: normalized.entities.itemsById || {},
  };
};

export const convertNodesToEntities = nodes => {
  const normalized = normalize(nodes, [listSchema]);

  return {
    listsById: normalized.entities.listsById || {},
    itemsById: normalized.entities.itemsById || {},
    childItemsById: normalized.entities.childItemsById || {},
  };
};

export const convertMembersToEntity = members => {
  const normalized = normalize(members, [memberSchema]);

  return normalized.entities.byId || {};
};

export const convertTeamsToEntity = teams => {
  const normalized = normalize(teams, [teamSchema]);

  return normalized.entities.byId || {};
};
