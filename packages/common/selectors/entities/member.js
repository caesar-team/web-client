import { createSelector } from 'reselect';
import { ROLE_ADMIN } from '../../constants';

export const entitiesSelector = state => state.entities;

export const memberEntitySelector = createSelector(
  entitiesSelector,
  entities => entities.member,
);

export const membersByIdSelector = createSelector(
  memberEntitySelector,
  memberEntity => memberEntity.byId || {},
);

export const memberIdPropSelector = (_, props) => props.memberId;

export const memberSelector = createSelector(
  membersByIdSelector,
  memberIdPropSelector,
  (membersById, memberId) => membersById[memberId],
);

export const memberListSelector = createSelector(
  membersByIdSelector,
  byId => Object.values(byId) || [],
);

const memberIdsPropSelector = (_, props) => props.memberIds;

export const membersBatchSelector = createSelector(
  membersByIdSelector,
  memberIdsPropSelector,
  (membersById, memberIds) => memberIds.map(memberId => membersById[memberId]),
);

export const memberAdminsSelector = createSelector(
  memberListSelector,
  membersList => membersList.map(({ roles }) => roles.include(ROLE_ADMIN)),
);
