/* eslint-disable no-console */
/* eslint-env node */

import Fs from 'fs';

const Package = JSON.parse(
	Fs.readFileSync(new URL('../package.json', import.meta.url)),
);

const path = process.argv[2];
const f = Fs.readFileSync(path, 'utf-8');
Fs.writeFileSync(path, f.replace('0.0.0-core.0', Package.version));
