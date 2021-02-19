import {JSDOM} from 'jsdom';

import {TypeUtil} from './type-util';

export const TestUtil = {
	createWindow: (): Window => {
		return TypeUtil.forceCast(new JSDOM('').window);
	},

	createEvent: (win: Window, type: string, options?: object): Event => {
		return options
			? new (win as any).Event(type, options)
			: new (win as any).Event(type);
	},

	createKeyboardEvent: (win: Window, type: string, options: object): Event => {
		return new (win as any).KeyboardEvent(type, options);
	},
};
