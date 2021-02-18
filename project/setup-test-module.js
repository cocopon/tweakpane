/* eslint-disable no-console */

'use strict';

const Fs = require('fs-extra');
const Package = require('../package');

Fs.renameSync(`tweakpane-${Package.version}.tgz`, 'tweakpane.tgz');
