const USER_GAMES_REQUESTED = 'fn-dash/games/USER_GAMES_REQUESTED';
const USER_GAMES_RECEIVED = 'fn-dash/games/USER_GAMES_RECEIVED';
const USER_GAMES_REJECTED = 'fn-dash/games/USER_GAMES_REJECTED';
const USER_RECORDS_REQUESTED = 'fn-dash/games/USER_RECORDS_REQUESTED';
const USER_RECORDS_RECEIVED = 'fn-dash/games/USER_RECORDS_RECEIVED';
const USER_RECORDS_REJECTED = 'fn-dash/games/USER_RECORDS_REJECTED';
const RECENT_GAMES_REQUESTED = 'fn-dash/games/RECENT_GAMES_REQUESTED';
const RECENT_GAMES_RECEIVED = 'fn-dash/games/RECENT_GAMES_RECEIVED';
const RECENT_GAMES_REJECTED = 'fn-dash/games/RECENT_GAMES_REJECTED';


export const types = {
  USER_GAMES_REQUESTED,
  USER_GAMES_RECEIVED,
  USER_GAMES_REJECTED,
  USER_RECORDS_REQUESTED,
  USER_RECORDS_RECEIVED,
  USER_RECORDS_REJECTED,
  RECENT_GAMES_REQUESTED,
  RECENT_GAMES_RECEIVED,
  RECENT_GAMES_REJECTED,
};

const initialState = {
  error: null,
  loading: false,
  data: {
    games: [],
    records: [],
  },
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case USER_GAMES_REQUESTED: {
      return {
        ...state,
        error: null,
        loading: true,
        data: {
          ...state.data,
          games: [],
        },
      };
    }
    case USER_GAMES_RECEIVED: {
      return {
        ...state,
        error: null,
        loading: false,
        data: {
          ...state.data,
          games: payload,
        },
      };
    }
    case USER_GAMES_REJECTED: {
      return {
        ...state,
        error: payload,
        loading: false,
      };
    }
    case USER_RECORDS_REQUESTED: {
      return {
        ...state,
        loading: true,
        error: null,
        data: {
          ...state.data,
          records: [],
        },
      };
    }
    case USER_RECORDS_RECEIVED: {
      return {
        ...state,
        error: null,
        loading: false,
        data: {
          ...state.data,
          records: payload,
        },
      };
    }
    case USER_RECORDS_REJECTED: {
      return {
        ...state,
        error: payload,
        loading: false,
      };
    }
    case RECENT_GAMES_REQUESTED: {
      return {
        ...state,
        error: null,
        loading: true,
      };
    }
    case RECENT_GAMES_RECEIVED: {
      return {
        ...state,
        error: null,
        loading: false,
        data: {
          ...state.data,
          games: payload,
        },
      };
    }
    case RECENT_GAMES_REJECTED: {
      return {
        ...state,
        error: payload,
        loading: false,
      };
    }
    default: {
      return state;
    }
  }
};

const requestUserGames = (id, mode) => ({
  type: USER_GAMES_REQUESTED,
  payload: {
    id,
    mode,
  },
});

const receivedUserGames = games => ({
  type: USER_GAMES_RECEIVED,
  payload: games,
});

const rejectedUserGames = err => ({
  type: USER_GAMES_REJECTED,
  payload: err.message,
});

const requestUserRecords = id => ({
  type: USER_RECORDS_REQUESTED,
  payload: id,
});

const receivedUserRecords = records => ({
  type: USER_RECORDS_RECEIVED,
  payload: records,
});

const rejectedUserRecords = err => ({
  type: USER_RECORDS_REJECTED,
  payload: err.message,
});

const requestRecentGames = () => ({
  type: RECENT_GAMES_REQUESTED,
});

const receivedRecentGames = games => ({
  type: RECENT_GAMES_RECEIVED,
  payload: games,
});

const rejectedRecentGames = err => ({
  type: RECENT_GAMES_REJECTED,
  payload: err,
});

export const actions = {
  requestUserGames,
  receivedUserGames,
  rejectedUserGames,
  requestUserRecords,
  receivedUserRecords,
  rejectedUserRecords,
  requestRecentGames,
  receivedRecentGames,
  rejectedRecentGames,
};
