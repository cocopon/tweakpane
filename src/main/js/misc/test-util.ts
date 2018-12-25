import {JSDOM} from 'jsdom';

const TestUtil = {
	createWindow: (): Window => {
		return new JSDOM('').window;
	},
};

export default TestUtil;
