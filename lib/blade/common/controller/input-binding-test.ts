import * as assert from 'assert';
import {describe, it} from 'mocha';

import {InputBinding} from '../../../common/binding/input';
import {BindingTarget} from '../../../common/binding/target';
import {TextController} from '../../../common/controller/text';
import {
	createNumberFormatter,
	parseNumber,
} from '../../../common/converter/number';
import {numberFromUnknown} from '../../../common/converter/number';
import {BoundValue} from '../../../common/model/bound-value';
import {ValueMap} from '../../../common/model/value-map';
import {createViewProps} from '../../../common/model/view-props';
import {TestUtil} from '../../../misc/test-util';
import {LabeledPropsObject} from '../../labeled/view/labeled';
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
			blade: new Blade(),
			props: new ValueMap({
				label: 'foo',
			} as LabeledPropsObject),
			valueController: controller,
		});
		assert.strictEqual(bc.binding, binding);
		assert.strictEqual(bc.valueController, controller);
	});
});
