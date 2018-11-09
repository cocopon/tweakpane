// @flow

import {JSDOM} from 'jsdom';

// Flow doesn't provide Window type definition...
type Window = any;

const TestUtil = {
	createWindow(): Window {
		return (new JSDOM('')).window;
	},
};

export default TestUtil;
