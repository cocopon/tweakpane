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
import {createBlade} from '../../common/model/blade';
import {LabelController} from '../../label/controller/label';
import {LabelPropsObject} from '../../label/view/label';
import {TextApi} from './text';

describe(TextApi.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject({
				label: undefined,
			} as LabelPropsObject),
			valueController: new TextController(doc, {
				parser: (v: string) => v,
				props: ValueMap.fromObject({
					formatter: (v: string) => v,
				}),
				value: new PrimitiveValue(''),
				viewProps: createViewProps(),
			}),
		});
		const api = new TextApi(c);

		assertDisposes(api);
	});

	it('should have initial state', () => {
		const doc = TestUtil.createWindow().document;
		const formatter = (v: string) => v;
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject({
				label: 'foobar',
			} as LabelPropsObject),
			valueController: new TextController(doc, {
				parser: (v: string) => v,
				props: ValueMap.fromObject({
					formatter: formatter,
				}),
				value: new PrimitiveValue('hello'),
				viewProps: createViewProps(),
			}),
		});
		const api = new TextApi(c);

		assertInitialState(api);
		assert.strictEqual(api.formatter, formatter);
		assert.strictEqual(api.label, 'foobar');
		assert.strictEqual(api.value, 'hello');
	});

	it('should update properties', () => {
		const doc = TestUtil.createWindow().document;
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject({
				label: undefined,
			} as LabelPropsObject),
			valueController: new TextController(doc, {
				parser: (v: string) => v,
				props: ValueMap.fromObject({
					formatter: (v: string) => v,
				}),
				value: new PrimitiveValue('hello'),
				viewProps: createViewProps(),
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
		const doc = TestUtil.createWindow().document;
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject({
				label: undefined,
			} as LabelPropsObject),
			valueController: new TextController(doc, {
				parser: (v: string) => v,
				props: ValueMap.fromObject({
					formatter: (v: string) => v,
				}),
				value: new PrimitiveValue(''),
				viewProps: createViewProps(),
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
