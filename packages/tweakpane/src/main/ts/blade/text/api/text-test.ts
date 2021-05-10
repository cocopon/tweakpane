import {
	createBlade,
	createValue,
	LabelController,
	LabelPropsObject,
	TextController,
	ValueMap,
	ViewProps,
} from '@tweakpane/core';
import * as assert from 'assert';
import {describe, it} from 'mocha';

import {
	assertDisposes,
	assertInitialState,
	assertUpdates,
	createTestWindow,
} from '../../../misc/test-util';
import {TextApi} from './text';

describe(TextApi.name, () => {
	it('should dispose', () => {
		const doc = createTestWindow().document;
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: undefined,
			}),
			valueController: new TextController(doc, {
				parser: (v: string) => v,
				props: ValueMap.fromObject({
					formatter: (v: string) => v,
				}),
				value: createValue(''),
				viewProps: ViewProps.create(),
			}),
		});
		const api = new TextApi(c);

		assertDisposes(api);
	});

	it('should have initial state', () => {
		const doc = createTestWindow().document;
		const formatter = (v: string) => v;
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: 'foobar',
			}),
			valueController: new TextController(doc, {
				parser: (v: string) => v,
				props: ValueMap.fromObject({
					formatter: formatter,
				}),
				value: createValue('hello'),
				viewProps: ViewProps.create(),
			}),
		});
		const api = new TextApi(c);

		assertInitialState(api);
		assert.strictEqual(api.formatter, formatter);
		assert.strictEqual(api.label, 'foobar');
		assert.strictEqual(api.value, 'hello');
	});

	it('should update properties', () => {
		const doc = createTestWindow().document;
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: undefined,
			}),
			valueController: new TextController(doc, {
				parser: (v: string) => v,
				props: ValueMap.fromObject({
					formatter: (v: string) => v,
				}),
				value: createValue('hello'),
				viewProps: ViewProps.create(),
			}),
		});
		const api = new TextApi(c);

		assertUpdates(api);

		const inputElem = api.controller_.valueController.view.inputElement;
		const formatter = (v: string) => `${v}, world`;
		api.formatter = formatter;
		assert.strictEqual(api.formatter, formatter);
		assert.strictEqual(inputElem.value, 'hello, world');

		api.value = 'changed';
		assert.strictEqual(api.value, 'changed');

		api.label = 'buzqux';
		assert.strictEqual(api.label, 'buzqux');
	});

	it('should handle event', (done) => {
		const doc = createTestWindow().document;
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: undefined,
			}),
			valueController: new TextController(doc, {
				parser: (v: string) => v,
				props: ValueMap.fromObject({
					formatter: (v: string) => v,
				}),
				value: createValue(''),
				viewProps: ViewProps.create(),
			}),
		});
		const api = new TextApi(c);

		api.on('change', (ev) => {
			assert.strictEqual(ev.presetKey, undefined);
			assert.strictEqual(ev.target, api);
			assert.strictEqual(ev.value, 'changed');
			done();
		});
		api.value = 'changed';
	});
});
