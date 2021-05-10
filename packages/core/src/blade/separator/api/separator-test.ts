import {describe, it} from 'mocha';

import {ViewProps} from '../../../common/model/view-props';
import {createTestWindow} from '../../../misc/dom-test-util';
import {assertInitialState, assertUpdates} from '../../common/api/test-util';
import {createBlade} from '../../common/model/blade';
import {SeparatorController} from '../controller/separator';
import {SeparatorApi} from './separator';

describe(SeparatorApi.name, () => {
	it('should have initial state', () => {
		const doc = createTestWindow().document;
		const c = new SeparatorController(doc, {
			blade: createBlade(),
			viewProps: ViewProps.create(),
		});
		const api = new SeparatorApi(c);
		assertInitialState(api);
	});

	it('should update properties', () => {
		const doc = createTestWindow().document;
		const c = new SeparatorController(doc, {
			blade: createBlade(),
			viewProps: ViewProps.create(),
		});
		const api = new SeparatorApi(c);
		assertUpdates(api);
	});
});
