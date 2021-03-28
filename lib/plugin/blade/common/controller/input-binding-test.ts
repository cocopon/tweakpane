import * as assert from 'assert';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {InputBinding} from '../../../common/binding/input';
import {BindingTarget} from '../../../common/binding/target';
import {
	createNumberFormatter,
	parseNumber,
} from '../../../common/converter/number';
import {numberFromUnknown} from '../../../common/converter/number';
import {BoundValue} from '../../../common/model/bound-value';
import {ValueMap} from '../../../common/model/value-map';
import {createViewProps} from '../../../common/model/view-props';
import {TextController} from '../../../input-bindings/common/controller/text';
import {Blade} from '../model/blade';
import {InputBindingController} from './input-binding';

describe(InputBindingController.name, () => {
	it('should get properties', () => {
		const obj = {
			foo: 123,
		};
		const doc = TestUtil.createWindow().document;
		const value = new BoundValue(0);
		const binding = new InputBinding({
			reader: numberFromUnknown,
			target: new BindingTarget(obj, 'foo'),
			value: value,
			writer: (v) => v,
		});
		const controller = new TextController(doc, {
			parser: parseNumber,
			props: new ValueMap({
				formatter: createNumberFormatter(0),
			}),
			value: value,
			viewProps: createViewProps(),
		});
		const bc = new InputBindingController(doc, {
			binding: binding,
			controller: controller,
			label: 'foo',
			blade: new Blade(),
		});
		assert.strictEqual(bc.binding, binding);
		assert.strictEqual(bc.controller, controller);
		assert.strictEqual(bc.view.label, 'foo');
	});
});
