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
import {ValueMap} from '../../../common/model/value-map';
import {createValue} from '../../../common/model/values';
import {ViewProps} from '../../../common/model/view-props';
import {createTestWindow} from '../../../misc/dom-test-util';
import {createBlade} from '../../common/model/blade';
import {LabelPropsObject} from '../../label/view/label';
import {InputBindingController} from './input-binding';

describe(InputBindingController.name, () => {
	it('should get properties', () => {
		const obj = {
			foo: 123,
		};
		const doc = createTestWindow().document;
		const value = createValue(0);
		const binding = new InputBinding({
			reader: numberFromUnknown,
			target: new BindingTarget(obj, 'foo'),
			value: value,
			writer: (v) => v,
		});
		const controller = new TextController(doc, {
			parser: parseNumber,
			props: ValueMap.fromObject({
				formatter: createNumberFormatter(0),
			}),
			value: value,
			viewProps: ViewProps.create(),
		});
		const bc = new InputBindingController(doc, {
			binding: binding,
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: 'foo',
			}),
			valueController: controller,
		});
		assert.strictEqual(bc.binding, binding);
		assert.strictEqual(bc.valueController, controller);
	});
});
