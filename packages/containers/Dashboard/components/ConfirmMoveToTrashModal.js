import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPlural } from '@caesar/common/utils/string';
import {
  workInProgressItemSelector,
  workInProgressItemIdsSelector,
  workInProgressListSelector,
} from '@caesar/common/selectors/workflow';
import {
  trashListSelector,
  teamsTrashListsSelector,
} from '@caesar/common/selectors/entities/list';
import {
  setWorkInProgressItem,
  resetWorkInProgressItemIds,
} from '@caesar/common/actions/workflow';
import {
  moveItemRequest,
  moveItemsBatchRequest,
} from '@caesar/common/actions/entities/item';
import { ConfirmModal } from '@caesar/components';

export const ConfirmMoveToTrashModal = ({
  notification,
  isOpened,
  handleCloseModal,
}) => {
  const dispatch = useDispatch();
  const workInProgressItemIds = useSelector(workInProgressItemIdsSelector);
  const workInProgressList = useSelector(workInProgressListSelector);
  const workInProgressItem = useSelector(workInProgressItemSelector);
  const teamsTrashLists = useSelector(teamsTrashListsSelector);
  const trashList = useSelector(trashListSelector);

  const handleMoveToTrash = () => {
    const isTeamList = !!workInProgressList?.teamId;
    const trashListId = isTeamList
      ? teamsTrashLists.find(
          ({ teamId }) => teamId === workInProgressList.teamId,
        ).id
      : trashList.id;

    if (workInProgressItemIds.length > 0) {
      dispatch(moveItemsBatchRequest(workInProgressItemIds, trashListId));
      dispatch(resetWorkInProgressItemIds());

      notification.show({
        text: `The ${getPlural(workInProgressItemIds?.length, [
          'item has',
          'items have',
        ])} been removed`,
      });
    } else {
      dispatch(
        moveItemRequest(
          workInProgressItem.id,
          workInProgressItem.teamId || null,
          trashListId,
        ),
      );
      dispatch(setWorkInProgressItem(null));

      notification.show({
        text: `The '${workInProgressItem.data.name}' has been removed`,
      });
    }

    handleCloseModal();
  };

  const pluralItemText = getPlural(workInProgressItemIds?.length, [
    'item',
    'items',
  ]);

  return (
    <ConfirmModal
      isOpened={isOpened}
      title={`You are going to remove ${
        workInProgressItem
          ? `'${workInProgressItem.data.name}'`
          : pluralItemText
      }`}
      description={`Are you sure you want to move the ${
        workInProgressItem ? 'item' : pluralItemText
      } to trash?`}
      icon="trash"
      confirmBtnText="Remove"
      onClickConfirm={handleMoveToTrash}
      onClickCancel={handleCloseModal}
    />
  );
};
