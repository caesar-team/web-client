import { useState, useMemo } from 'react';
import { useEffectOnce, useUpdateEffect } from 'react-use';
import { useSelector } from 'react-redux';
import { TEAM_TYPE } from '@caesar/common/constants';
import { sortByName } from '@caesar/common/utils/utils';
import { transformListTitle } from '@caesar/common/utils/string';
import { currentUserVaultListSelector } from '@caesar/common/selectors/currentUser';
import { teamsByIdSelector } from '@caesar/common/selectors/entities/team';
import { getTeamTitle } from '@caesar/common/utils/team';
import { getMovableLists } from '../api';

const getListTitle = (listId, lists) =>
  transformListTitle(lists.find(list => list.id === listId)?.label);

export const useItemVaultAndListOptions = ({ teamId = null, listId }) => {
  // TODO: Hot fix for [CAES-1329]
  const vaults =
    useSelector(currentUserVaultListSelector).filter(
      vault => typeof vault !== 'undefined',
    ) || [];
  const teamsById = useSelector(teamsByIdSelector);
  const [lists, setLists] = useState([]);
  const [checkedTeamId, setCheckedTeamId] = useState(teamId);
  const [checkedListId, setCheckedListId] = useState(listId);

  useEffectOnce(() => {
    getMovableLists().then(({ data }) => {
      setLists(
        data.map(list => ({
          ...list,
          teamId: list.teamId || TEAM_TYPE.PERSONAL,
        })),
      );
    });
  });

  useUpdateEffect(() => {
    const defaultTeamListId = lists.find(
      list => list.teamId === checkedTeamId && list.label === 'default',
    )?.id;

    setCheckedListId(defaultTeamListId);
  }, [checkedTeamId]);

  const teamOptions = useMemo(
    () =>
      // TODO: To enable move item between vaults remove 'id === teamId' condition
      vaults
        .filter(({ id, locked }) => !locked && id === teamId)
        .sort((a, b) => {
          if (a.title.toLowerCase() === TEAM_TYPE.PERSONAL) return -1;
          if (b.title.toLowerCase() === TEAM_TYPE.PERSONAL) return 1;

          if (a.title.toLowerCase() === TEAM_TYPE.DEFAULT) return 1;
          if (b.title.toLowerCase() === TEAM_TYPE.DEFAULT) return -1;

          return sortByName(a.title, b.title);
        })
        .map(team =>
          team.type === TEAM_TYPE.DEFAULT
            ? {
                ...team,
                title: getTeamTitle(team),
              }
            : team,
        ),
    [vaults],
  );

  const listOptions = useMemo(
    () =>
      lists
        .filter(list => list.teamId === checkedTeamId)
        .map(list => ({
          ...list,
          label: transformListTitle(list.label),
        })),
    [lists, checkedTeamId],
  );

  return {
    checkedTeamId,
    checkedTeamTitle: getTeamTitle(teamsById[checkedTeamId]),
    checkedListId,
    checkedListLabel: getListTitle(checkedListId, lists),
    setCheckedTeamId,
    setCheckedListId,
    teamOptions,
    listOptions,
  };
};
