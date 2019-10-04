import { put, call, fork, takeLatest, select, all } from 'redux-saga/effects';
import { decryption } from 'common/sagas/common/decryption';
import {
  INIT_WORKFLOW,
  UPDATE_WORK_IN_PROGRESS_ITEM,
  finishIsLoading,
  setWorkInProgressListId,
  setWorkInProgressItem,
  resetWorkInProgressItemIds,
} from 'common/actions/workflow';
import { addListsBatch } from 'common/actions/entities/list';
import { addItemsBatch } from 'common/actions/entities/item';
import { SET_CURRENT_TEAM_ID, setCurrentTeamId } from 'common/actions/user';
import { addChildItemsBatch } from 'common/actions/entities/childItem';
import { fetchMembersSaga } from 'common/sagas/entities/member';
import { convertNodesToEntities } from 'common/normalizers/normalizers';
import { objectToArray } from 'common/utils/utils';
import { sortItemsByFavorites } from 'common/utils/workflow';
import { getLists, getTeamLists, getTeams } from 'common/api';
import { DEFAULT_TEAM_TYPE, ITEM_REVIEW_MODE } from 'common/constants';
import { favoriteListSelector } from 'common/selectors/entities/list';
import {
  keyPairSelector,
  masterPasswordSelector,
  currentTeamIdSelector,
} from 'common/selectors/user';
import { itemSelector } from 'common/selectors/entities/item';
import { workInProgressItemSelector } from 'common/selectors/workflow';
import { getFavoritesList } from 'common/normalizers/utils';
import { fetchTeamSuccess } from '../actions/entities/team';

function* initPersonal() {
  try {
    const { data: lists } = yield call(getLists);

    const { listsById, itemsById, childItemsById } = convertNodesToEntities(
      lists,
    );

    const keyPair = yield select(keyPairSelector);
    const masterPassword = yield select(masterPasswordSelector);

    yield fork(decryption, {
      items: sortItemsByFavorites(objectToArray(itemsById)),
      key: keyPair.privateKey,
      masterPassword,
    });

    const favoritesList = getFavoritesList(itemsById);

    yield put(
      addListsBatch({
        ...listsById,
        [favoritesList.id]: favoritesList,
      }),
    );
    yield put(addChildItemsBatch(childItemsById));

    const favoriteList = yield select(favoriteListSelector);
    yield put(setWorkInProgressListId(favoriteList.id));

    yield put(finishIsLoading());
  } catch (error) {
    console.log(error);
  }
}

function* initTeam(team) {
  try {
    yield put(fetchTeamSuccess(team));

    const currentTeamId = yield select(currentTeamIdSelector);

    if (!currentTeamId && team.type === DEFAULT_TEAM_TYPE) {
      yield put(setCurrentTeamId(team.id));
    } else {
      const { data: lists } = yield call(getTeamLists, team.id);

      const { listsById, itemsById, childItemsById } = convertNodesToEntities(
        lists,
      );

      yield put(addListsBatch(listsById));
      yield put(addChildItemsBatch(childItemsById));

      if (currentTeamId === team.id) {
        const keyPair = yield select(keyPairSelector);
        const masterPassword = yield select(masterPasswordSelector);

        yield fork(decryption, {
          items: objectToArray(itemsById),
          key: keyPair.privateKey,
          masterPassword,
        });
      } else {
        yield put(addItemsBatch(itemsById));
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function* initTeams() {
  try {
    const { data: teams } = yield call(getTeams);

    yield all(teams.map(team => call(initTeam, team)));
  } catch (error) {
    console.log(error);
  }
}

export function* initWorkflow() {
  yield fork(fetchMembersSaga);
  yield fork(initPersonal);
  yield fork(initTeams);
}

export function* updateWorkInProgressItemSaga({
  payload: { itemId, mode = ITEM_REVIEW_MODE },
}) {
  let id = null;

  if (!itemId) {
    const workInProgressItem = yield select(workInProgressItemSelector);

    if (workInProgressItem) {
      id = workInProgressItem.id;
    }
  } else {
    id = itemId;
  }

  if (id) {
    const item = yield select(itemSelector, { itemId: id });

    yield put(setWorkInProgressItem(item, mode));
  }
}

export function* setCurrentTeamIdWatchSaga() {
  yield put(setWorkInProgressItem(null));
  yield put(resetWorkInProgressItemIds(null));
  yield put(setWorkInProgressListId(null));

  const currentTeamId = yield select(currentTeamIdSelector);

  if (!currentTeamId) {
    return;
  }

  const { data } = yield call(getTeamLists, currentTeamId);

  const { listsById, itemsById, childItemsById } = convertNodesToEntities(data);

  yield put(addListsBatch(listsById));
  yield put(addChildItemsBatch(childItemsById));

  const keyPair = yield select(keyPairSelector);
  const masterPassword = yield select(masterPasswordSelector);

  yield fork(decryption, {
    items: objectToArray(itemsById),
    key: keyPair.privateKey,
    masterPassword,
  });
}

export default function* workflowSagas() {
  yield takeLatest(INIT_WORKFLOW, initWorkflow);
  yield takeLatest(UPDATE_WORK_IN_PROGRESS_ITEM, updateWorkInProgressItemSaga);
  yield takeLatest(SET_CURRENT_TEAM_ID, setCurrentTeamIdWatchSaga);
}
