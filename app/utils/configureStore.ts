import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory, createMemoryHistory } from 'history';
import jwtDecode from 'jwt-decode';
import { omit } from 'lodash';
import {
  // $FlowFixMe
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
} from 'redux';
import { createLogger } from 'redux-logger';
import createSentryMiddleware from 'redux-sentry-middleware';
import thunkMiddleware from 'redux-thunk';
import { $Shape } from 'utility-types';
import { addToast } from 'app/actions/ToastActions';
import { selectCurrentUser } from 'app/reducers/auth';
import type { State, Store, GetCookie } from 'app/types';
import createRootReducer from '../reducers';
import createMessageMiddleware from './messageMiddleware';
import promiseMiddleware from './promiseMiddleware';

const sentryMiddlewareOptions = {
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
const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true,
});
export const history = __CLIENT__
  ? createBrowserHistory()
  : createMemoryHistory();
export default function configureStore(
  initialState: State | $Shape<Record<string, never>> = {},
  {
    Sentry,
    getCookie,
  }: {
    Sentry?: any | null | undefined;
    getCookie?: GetCookie;
  } = {}
): Store {
  const messageMiddleware = createMessageMiddleware(
    (message) =>
      addToast({
        message,
      }),
    Sentry
  );
  const middlewares = [
    routerMiddleware(history),
    thunkMiddleware.withExtraArgument({
      getCookie,
    }),
    promiseMiddleware(),
    Sentry && createSentryMiddleware(Sentry, sentryMiddlewareOptions),
    messageMiddleware,
  ].filter(Boolean);

  if (__CLIENT__) {
    const createWebSocketMiddleware = require('./websockets').default;

    middlewares.push(createWebSocketMiddleware());
  }

  if (__DEV__ && __CLIENT__) {
    middlewares.push(loggerMiddleware);
  }

  const composeEnhancer =
    global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  // We need to migrate to @reduxjs/toolkit, but this alias removes the deprication warning
  // https://github.com/reduxjs/redux/releases/tag/v4.2.0
  const store = createStore(
    createRootReducer(history),
    initialState,
    composeEnhancer(applyMiddleware(...middlewares))
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default;

      store.replaceReducer(nextReducer);
    });
  }

  return store;
}