import { put, call, takeLatest, select } from 'redux-saga/effects';
import {
  FETCH_USER_SELF_REQUEST,
  FETCH_KEY_PAIR_REQUEST,
  FETCH_USER_TEAMS_REQUEST,
  SET_CURRENT_TEAM_ID,
  fetchUserSelfSuccess,
  fetchUserSelfFailure,
  fetchKeyPairSuccess,
  fetchKeyPairFailure,
  fetchUserTeamsSuccess,
  fetchUserTeamsFailure,
  setCurrentTeamId,
} from 'common/actions/user';
import { addTeamsBatch } from 'common/actions/entities/team';
import { addMembersBatch } from 'common/actions/entities/member';
import { currentTeamIdSelector } from 'common/selectors/user';
import { convertTeamsToEntity } from 'common/normalizers/normalizers';
import { getUserSelf, getKeys, getUserTeams } from 'common/api';
import { setCookieValue } from 'common/utils/token';

export function* fetchUserSelfSaga() {
  try {
    const { data: user } = yield call(getUserSelf);

    yield put(fetchUserSelfSuccess(user));
    yield put(addMembersBatch({ [user.id]: user }));
  } catch (error) {
    console.log('error', error);
    yield put(fetchUserSelfFailure());
  }
}

export function* fetchKeyPairSaga() {
  try {
    const { data } = yield call(getKeys);

    yield put(
      fetchKeyPairSuccess({
        privateKey: data.encryptedPrivateKey,
        publicKey: data.publicKey,
      }),
    );
  } catch (error) {
    console.log('error', error);
    yield put(fetchKeyPairFailure());
  }
}

export function* fetchUserTeamsSaga() {
  try {
    const { data } = yield call(getUserTeams);

    if (data.length) {
      yield put(fetchUserTeamsSuccess(data.map(({ id }) => id)));
      // TODO: need fixes from BE
      yield put(addTeamsBatch(convertTeamsToEntity(data)));

      const currentTeamId = yield select(currentTeamIdSelector);
      put(setCurrentTeamId(currentTeamId || data[0].id));
    }
  } catch (error) {
    console.log('error', error);
    yield put(fetchUserTeamsFailure());
  }
}

function* setCurrentTeamIdSaga({ payload: { teamId } }) {
  yield call(setCookieValue, 'teamId', teamId);
}

export default function* userSagas() {
  yield takeLatest(FETCH_USER_SELF_REQUEST, fetchUserSelfSaga);
  yield takeLatest(FETCH_KEY_PAIR_REQUEST, fetchKeyPairSaga);
  yield takeLatest(FETCH_USER_TEAMS_REQUEST, fetchUserTeamsSaga);
  yield takeLatest(SET_CURRENT_TEAM_ID, setCurrentTeamIdSaga);
}
