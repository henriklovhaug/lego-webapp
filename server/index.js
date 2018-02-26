/* eslint-disable no-console */

import 'babel-polyfill';
import http from 'http';
import { JSDOM } from 'jsdom';
import app from './server';
import Raven from 'raven';
import config from './env';

Raven.config(config.ravenDsn, {
  release: config.release,
  environment: config.environment,
  logger: 'node'
}).install();

// This is a hack to use draft-convert on the server.
// draft-convert performs a `typeof HTMLElement` which can't really be worked around.
const { window } = new JSDOM('<!doctype html><html><body></body></html>');
global.HTMLElement = window.HTMLElement;

const server = http.createServer(app);
let currentApp = app;
const log = app.get('log');

app.listen(app.get('port'), app.get('host'), err => {
  if (err) {
    log.error(err, 'could_not_start_server');
  }
  log.info({ port: app.get('port'), host: app.get('host') }, 'app_started');
});

if (module.hot) {
  module.hot.accept('./server', () => {
    server.removeListener('request', currentApp);
    server.on('request', app);
    currentApp = app;
  });
}
