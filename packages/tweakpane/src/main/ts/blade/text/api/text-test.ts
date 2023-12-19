import {
	createBlade,
	createValue,
	Formatter,
	LabeledValueBladeController,
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
} from '../../../misc/test-util.js';
import {TextBladeApi} from './text.js';

function createApi(
	doc: Document,
	config: {
		formatter: Formatter<string>;
		initialValue: string;
		label: string | null | undefined;
	},
): TextBladeApi<string> {
	const v = createValue(config.initialValue);
	const c = new LabeledValueBladeController<string, TextController<string>>(
		doc,
		{
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: config.label,
			}),
			value: v,
			valueController: new TextController(doc, {
				parser: (v: string) => v,
				props: ValueMap.fromObject({
					formatter: config.formatter,
				}),
				value: v,
				viewProps: ViewProps.create(),
			}),
		},
	);
	return new TextBladeApi(c);
}

describe(TextBladeApi.name, () => {
	it('should dispose', () => {
		const doc = createTestWindow().document;
		const v = createValue('');
		const c = new LabeledValueBladeController<string, TextController<string>>(
			doc,
			{
				blade: createBlade(),
				props: ValueMap.fromObject<LabelPropsObject>({
					label: undefined,
				}),
				value: v,
				valueController: new TextController(doc, {
					parser: (v: string) => v,
					props: ValueMap.fromObject({
						formatter: (v: string) => v,
					}),
					value: v,
					viewProps: ViewProps.create(),
				}),
			},
		);
		const api = new TextBladeApi(c);

		assertDisposes(api);
	});

	it('should have initial state', () => {
		const doc = createTestWindow().document;
		const formatter = (v: string) => v;
		const api = createApi(doc, {
			formatter: formatter,
			initialValue: 'hello',
			label: 'foobar',
		});

		assertInitialState(api);
		assert.strictEqual(api.formatter, formatter);
		assert.strictEqual(api.label, 'foobar');
		assert.strictEqual(api.value, 'hello');
	});

	it('should update properties', () => {
		const doc = createTestWindow().document;
		const api = createApi(doc, {
			formatter: (v: string) => v,
			initialValue: 'hello',
			label: undefined,
		});

		assertUpdates(api);

		const inputElem = api.controller.valueController.view.inputElement;
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
		const api = createApi(doc, {
			formatter: (v: string) => v,
			initialValue: '',
			label: undefined,
		});

		api.on('change', (ev) => {
			assert.strictEqual(ev.target, api);
			assert.strictEqual(ev.value, 'changed');
			done();
		});
		api.value = 'changed';
	});

	it('should unlisten event', () => {
		const doc = createTestWindow().document;
		const api = createApi(doc, {
			formatter: (v: string) => v,
			initialValue: '',
			label: undefined,
		});
		const handler = () => {
			assert.fail('should not be called');
		};

		api.on('change', handler);
		api.off('change', handler);
		api.value = 'changed';
	});
});
