import {JSDOM} from 'jsdom';

import {forceCast} from './type-util';

export function createTestWindow(): Window {
	return forceCast(new JSDOM('').window);
}
