import jwtDecode from 'jwt-decode';
import { omit } from 'lodash';
import createSentryMiddleware from 'redux-sentry-middleware';
import { selectCurrentUser } from 'app/reducers/auth';
import type { State } from 'app/types';

const sentryMiddlewareOptions: createSentryMiddleware.Options<State> = {
  stateTransformer: (state) => {
    try {
      const token = jwtDecode(state.auth.token);
      return { ...state, auth: { ...state.auth, token } };
    } catch (e) {
      return state;
    }
  },
  getUserContext: (state) => omit(selectCurrentUser(state), 'icalToken'),
};

// TODO: Remove any
const create = (Sentry: any) =>
  createSentryMiddleware(Sentry, sentryMiddlewareOptions);

export default create;
