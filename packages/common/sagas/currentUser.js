/* eslint-disable no-console */
import Router from 'next/router';
import { put, call, all, select, takeLatest } from 'redux-saga/effects';
import { difference } from 'lodash';
import {
  FETCH_USER_SELF_REQUEST,
  FETCH_KEY_PAIR_REQUEST,
  FETCH_USER_TEAMS_REQUEST,
  LOGOUT,
  fetchUserSelfSuccess,
  fetchUserSelfFailure,
  fetchKeyPairFailure,
  fetchUserTeamsSuccess,
  fetchUserTeamsFailure,
  LEAVE_TEAM_REQUEST,
  leaveTeamFailure,
  leaveTeamSuccess,
} from '@caesar/common/actions/currentUser';
import { addPersonalKeyPair } from '@caesar/common/actions/keystore';
import {
  updateGlobalNotification,
  resetStore,
} from '@caesar/common/actions/application';
import { removeTeamMemberSuccess } from '@caesar/common/actions/entities/member';
import { removeMemberFromTeam } from '@caesar/common/actions/entities/team';
import {
  currentUserIdSelector,
  currentUserTeamIdsSelector,
} from '@caesar/common/selectors/currentUser';
import { memberByUserIdAndTeamIdSelector } from '@caesar/common/selectors/entities/member';
import { getServerErrorMessage } from '@caesar/common/utils/error';
import {
  getUserSelf,
  getKeys,
  getUserTeams,
  postLeaveTeam,
  postLogout,
} from '@caesar/common/api';
import { removeCookieValue, clearStorage } from '@caesar/common/utils/token';
import { createPermissionsFromLinks } from '@caesar/common/utils/createPermissionsFromLinks';
import { ROUTES } from '@caesar/common/constants';
import { clearStateWhenLeaveTeam } from './entities/team';
import { normalizeCurrentUser } from '@caesar/common/normalizers/normalizers';

export function* checkIfUserWasKickedFromTeam(userTeamIdsFromRequest) {
  try {
    const userTeamIds = yield select(currentUserTeamIdsSelector);

    if (!userTeamIds) return;

    let validUserTeamIds = [];

    if (userTeamIdsFromRequest) {
      validUserTeamIds = userTeamIdsFromRequest;
    } else {
      const { data } = yield call(getUserTeams);

      validUserTeamIds = data.map(({ id }) => id);
    }

    const diff = difference(userTeamIds, validUserTeamIds);

    if (diff.length) {
      yield call(clearStateWhenLeaveTeam, { payload: { teamIds: diff } });

      yield all(diff.map(teamId => put(leaveTeamSuccess(teamId))));
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export function* fetchUserSelfSaga() {
  try {
    const { data: currentUser } = yield call(getUserSelf);

    yield call(checkIfUserWasKickedFromTeam, currentUser?.data?.teamIds);
    yield put(fetchUserSelfSuccess(normalizeCurrentUser(currentUser)));
  } catch (error) {
    console.error('error', error);
    yield put(fetchUserSelfFailure());
  }
}

export function* fetchKeyPairSaga() {
  try {
    const { data } = yield call(getKeys);

    yield put(
      addPersonalKeyPair({
        privateKey: data.encryptedPrivateKey,
        publicKey: data.publicKey,
      }),
    );
  } catch (error) {
    console.error('error', error);
    yield put(fetchKeyPairFailure());
  }
}

export function* fetchUserTeamsSaga() {
  try {
    const { data } = yield call(getUserTeams);

    if (data.length) {
      yield put(fetchUserTeamsSuccess(data.map(({ id }) => id)));
    }
  } catch (error) {
    console.error('error', error);
    yield put(fetchUserTeamsFailure());
  }
}

export function* leaveTeamSaga({ payload: { teamId } }) {
  try {
    yield call(postLeaveTeam, teamId);
    const userId = yield select(currentUserIdSelector);
    const member = yield select(memberByUserIdAndTeamIdSelector, {
      userId,
      teamId,
    });

    yield put(leaveTeamSuccess(teamId));
    yield put(removeTeamMemberSuccess(member.id));
    yield put(removeMemberFromTeam(member.teamId, member.id));
    yield call(clearStateWhenLeaveTeam, { payload: { teamIds: [teamId] } });

    const {
      router: { route },
    } = Router;

    if (route === `${ROUTES.SETTINGS}${ROUTES.TEAM}/[id]`) {
      yield call(Router.push, ROUTES.SETTINGS + ROUTES.TEAM);
    }
  } catch (e) {
    yield put(updateGlobalNotification(getServerErrorMessage(e), false, true));
    yield put(leaveTeamFailure());
  }
}

export function* logoutSaga() {
  try {
    yield call(postLogout);
    yield call(removeCookieValue, 'token');
    // TODO: Need to identify if we use this 'share' cookie or not
    yield call(removeCookieValue, 'share');
    yield call(clearStorage);
    yield put(resetStore());
    yield call(Router.push, ROUTES.SIGN_IN);
  } catch (error) {
    console.error('error', error);
  }
}

export default function* currentUserSagas() {
  yield takeLatest(FETCH_USER_SELF_REQUEST, fetchUserSelfSaga);
  yield takeLatest(FETCH_KEY_PAIR_REQUEST, fetchKeyPairSaga);
  yield takeLatest(FETCH_USER_TEAMS_REQUEST, fetchUserTeamsSaga);
  yield takeLatest(LEAVE_TEAM_REQUEST, leaveTeamSaga);
  yield takeLatest(LOGOUT, logoutSaga);
}
