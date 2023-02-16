/* eslint-disable no-console, @typescript-eslint/no-var-requires */
/* eslint-env node */

'use strict';

const Fs = require('fs');
const Package = require('../package.json');

const path = process.argv[2];
const f = Fs.readFileSync(path, 'utf-8');
Fs.writeFileSync(path, f.replace('0.0.0-core.0', Package.version));
