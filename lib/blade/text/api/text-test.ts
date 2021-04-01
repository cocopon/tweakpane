import * as assert from 'assert';
import {describe, it} from 'mocha';

import {PrimitiveValue} from '../../../common/model/primitive-value';
import {ValueMap} from '../../../common/model/value-map';
import {createViewProps} from '../../../common/model/view-props';
import {TextController} from '../../../input-binding/common/controller/text';
import {TestUtil} from '../../../misc/test-util';
import {Blade} from '../../common/model/blade';
import {LabeledController} from '../../labeled/controller';
import {LabeledPropsObject} from '../../labeled/view';
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
		api.dispose();
		assert.strictEqual(api.controller_.blade.disposed, true);
	});

	it('should have initial state', () => {
		const doc = TestUtil.createWindow().document;
		const formatter = (v: string) => v;
		const c = new LabeledController(doc, {
			blade: new Blade(),
			props: new ValueMap({
				label: undefined,
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
		assert.strictEqual(api.disabled, false);
		assert.strictEqual(api.hidden, false);
		assert.strictEqual(api.formatter, formatter);
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

		api.disabled = true;
		assert.strictEqual(api.disabled, true);

		api.hidden = true;
		assert.strictEqual(api.hidden, true);

		const inputElem = api.controller_.valueController.view.inputElement;
		const formatter = (v: string) => `${v}, world`;
		api.formatter = formatter;
		assert.strictEqual(api.formatter, formatter);
		assert.strictEqual(inputElem.value, 'hello, world');

		api.value = 'changed';
		assert.strictEqual(api.value, 'changed');
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
