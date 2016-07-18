'use strict';

const webdriver = require('selenium-webdriver');
const Path = require('path');
const Http = require('http');
const express = require('express');
const serveIndex = require('serve-index');

const BASE_DIR = Path.join(__dirname, '..');


function createServer() {
  const StaticResourceMap = {
    '/': Path.join(BASE_DIR, 'e2e/public'),
    '/src': Path.join(BASE_DIR, 'src/main/js'),
    '/dst': Path.join(BASE_DIR, 'dst'),
    '/node_modules': Path.join(BASE_DIR, 'node_modules'),
  };

  const app = express();

  for (let webUrl in StaticResourceMap) {
    const filePath = StaticResourceMap[webUrl];
    app.use(webUrl, serveIndex(filePath));
    app.use(webUrl, express.static(filePath));
  }

  return Http.createServer(app);
}


function createServerController(port, hostname) {
  const promisedServer = new webdriver.promise.Promise((resolve, reject) => {
    const server = createServer();

    server.on('listening', () => {
      resolve(server);
    });

    server.on('error', (error) => {
      reject(error);
    });

    server.listen(port, hostname);
  });

  return {
    waitForStart: () => promisedServer,
    stop: () => promisedServer.then((server) => server.close()),
  };
}


module.exports = createServerController;
