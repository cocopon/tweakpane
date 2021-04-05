import {describe, it} from 'mocha';

import {createViewProps} from '../../../common/model/view-props';
import {TestUtil} from '../../../misc/test-util';
import {assertInitialState, assertUpdates} from '../../common/api/test-util';
import {Blade} from '../../common/model/blade';
import {SeparatorController} from '../controller/separator';
import {SeparatorApi} from './separator';

describe(SeparatorApi.name, () => {
	it('should have initial state', () => {
		const doc = TestUtil.createWindow().document;
		const c = new SeparatorController(doc, {
			blade: new Blade(),
			viewProps: createViewProps(),
		});
		const api = new SeparatorApi(c);
		assertInitialState(api);
	});

	it('should update properties', () => {
		const doc = TestUtil.createWindow().document;
		const c = new SeparatorController(doc, {
			blade: new Blade(),
			viewProps: createViewProps(),
		});
		const api = new SeparatorApi(c);
		assertUpdates(api);
	});
});
