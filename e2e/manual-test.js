/* eslint-disable no-console */
'use strict';

const PORT = process.env.PORT || 9998;
const HOSTNAME = process.env.HOSTNAME || 'localhost';

const createServerController = require('./server.js');
const controller = createServerController(PORT, HOSTNAME);
controller.waitForStart()
  .then(() => {
    console.info(`Server is ready. Please open http://${HOSTNAME}:${PORT}.`);
  });
