import {createBlade, ViewProps} from '@tweakpane/core';
import {describe, it} from 'mocha';

import {
	assertInitialState,
	assertUpdates,
	createTestWindow,
} from '../../../misc/test-util';
import {SeparatorController} from '../controller/separator';
import {SeparatorBladeApi} from './separator';

describe(SeparatorBladeApi.name, () => {
	it('should have initial state', () => {
		const doc = createTestWindow().document;
		const c = new SeparatorController(doc, {
			blade: createBlade(),
			viewProps: ViewProps.create(),
		});
		const api = new SeparatorBladeApi(c);
		assertInitialState(api);
	});

	it('should update properties', () => {
		const doc = createTestWindow().document;
		const c = new SeparatorController(doc, {
			blade: createBlade(),
			viewProps: ViewProps.create(),
		});
		const api = new SeparatorBladeApi(c);
		assertUpdates(api);
	});
});
