export const ADD_PERSONAL_KEY_PAIR = '@keyStore/ADD_PERSONAL_KEY_PAIR';
export const REMOVE_PERSONAL_KEY_PAIR = '@keyStore/REMOVE_PERSONAL_KEY_PAIR';
export const ADD_TEAM_KEY_PAIR = '@keyStore/ADD_TEAM_KEY_PAIR';
export const REMOVE_TEAM_KEY_PAIR = '@keyStore/REMOVE_TEAM_KEY_PAIR';
export const ADD_ANONYMOUS_KEY_PAIR = '@keyStore/ADD_ANONYMOUS_KEY_PAIR';
export const REMOVE_ANONYMOUS_KEY_PAIR = '@keyStore/REMOVE_ANONYMOUS_KEY_PAIR';

export const addPersonalKeyPair = data => ({
  type: ADD_PERSONAL_KEY_PAIR,
  payload: {
    data,
  },
});

export const addTeamKeyPair = data => ({
  type: ADD_TEAM_KEY_PAIR,
  payload: {
    data,
  },
});

export const addAnonymousKeyPair = data => ({
  type: ADD_ANONYMOUS_KEY_PAIR,
  payload: {
    data,
  },
});

export const removePersonalKeyPair = () => ({
  type: REMOVE_PERSONAL_KEY_PAIR,
});

export const removeTeamKeyPair = teamName => ({
  type: REMOVE_TEAM_KEY_PAIR,
  payload: {
    teamName,
  },
});

export const removeAnonymousKeyPair = keyId => ({
  type: REMOVE_ANONYMOUS_KEY_PAIR,
  payload: {
    keyId,
  },
});

