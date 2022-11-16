import { configureStore } from '@reduxjs/toolkit';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory, createMemoryHistory } from 'history';
import { addToast } from 'app/actions/ToastActions';
import rootReducer from 'app/reducers';
import loggerMiddleware from 'app/store/middleware/loggerMiddleware';
import createMessageMiddleware from 'app/store/middleware/messageMiddleware';
import promiseMiddleware from 'app/store/middleware/promiseMiddleware';
import createSentryMiddleware from 'app/store/middleware/sentryMiddleware';
import type { GetCookie } from 'app/types';
import type { History } from 'history';

export const history: History = __CLIENT__
  ? createBrowserHistory()
  : createMemoryHistory();

const createStore = (
  initialState = {},
  {
    Sentry,
    getCookie,
  }: {
    Sentry?: any;
    getCookie?: GetCookie;
  } = {}
) => {
  const store = configureStore({
    preloadedState: initialState,
    reducer: rootReducer(history),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {
            getCookie,
          },
        },
      })
        .prepend(promiseMiddleware())
        .concat(
          [
            routerMiddleware(history),
            createMessageMiddleware(
              (message) =>
                addToast({
                  message,
                }),
              Sentry
            ),
            Sentry && createSentryMiddleware(Sentry),
            __CLIENT__ &&
              require('app/store/middleware/websocketMiddleware').default(),
            __CLIENT__ && __DEV__ && loggerMiddleware,
          ].filter(Boolean)
        ),
  });

  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      const nextReducer = require('./rootReducer').default;

      store.replaceReducer(nextReducer(history));
    });
  }

  return store;
};

export default createStore;

export type Store = ReturnType<typeof createStore>;
export type AppDispatch = Store['dispatch'];
