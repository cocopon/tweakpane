import * as assert from 'assert';
import {describe, it} from 'mocha';

import {TextController} from '../../../common/controller/text';
import {PrimitiveValue} from '../../../common/model/primitive-value';
import {ValueMap} from '../../../common/model/value-map';
import {createViewProps} from '../../../common/model/view-props';
import {TestUtil} from '../../../misc/test-util';
import {
	assertDisposes,
	assertInitialState,
	assertUpdates,
} from '../../common/api/test-util';
import {Blade} from '../../common/model/blade';
import {LabeledController} from '../../labeled/controller/labeled';
import {LabeledPropsObject} from '../../labeled/view/labeled';
import {TextBladeApi} from './text';

describe(TextBladeApi.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new LabeledController(doc, {
			blade: new Blade(),
			props: new ValueMap({
				label: undefined,
			} as LabeledPropsObject),
			valueController: new TextController(doc, {
				parser: (v: string) => v,
				props: new ValueMap({
					formatter: (v: string) => v,
				}),
				value: new PrimitiveValue(''),
				viewProps: createViewProps(),
			}),
		});
		const api = new TextBladeApi(c);

		assertDisposes(api);
	});

	it('should have initial state', () => {
		const doc = TestUtil.createWindow().document;
		const formatter = (v: string) => v;
		const c = new LabeledController(doc, {
			blade: new Blade(),
			props: new ValueMap({
				label: 'foobar',
			} as LabeledPropsObject),
			valueController: new TextController(doc, {
				parser: (v: string) => v,
				props: new ValueMap({
					formatter: formatter,
				}),
				value: new PrimitiveValue('hello'),
				viewProps: createViewProps(),
			}),
		});
		const api = new TextBladeApi(c);

		assertInitialState(api);
		assert.strictEqual(api.formatter, formatter);
		assert.strictEqual(api.label, 'foobar');
		assert.strictEqual(api.value, 'hello');
	});

	it('should update properties', () => {
		const doc = TestUtil.createWindow().document;
		const c = new LabeledController(doc, {
			blade: new Blade(),
			props: new ValueMap({
				label: undefined,
			} as LabeledPropsObject),
			valueController: new TextController(doc, {
				parser: (v: string) => v,
				props: new ValueMap({
					formatter: (v: string) => v,
				}),
				value: new PrimitiveValue('hello'),
				viewProps: createViewProps(),
			}),
		});
		const api = new TextBladeApi(c);

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
		const doc = TestUtil.createWindow().document;
		const c = new LabeledController(doc, {
			blade: new Blade(),
			props: new ValueMap({
				label: undefined,
			} as LabeledPropsObject),
			valueController: new TextController(doc, {
				parser: (v: string) => v,
				props: new ValueMap({
					formatter: (v: string) => v,
				}),
				value: new PrimitiveValue(''),
				viewProps: createViewProps(),
			}),
		});
		const api = new TextBladeApi(c);

		api.on('change', (ev) => {
			assert.strictEqual(ev.presetKey, undefined);
			assert.strictEqual(ev.target, api);
			assert.strictEqual(ev.value, 'changed');
			done();
		});
		api.value = 'changed';
	});
});
