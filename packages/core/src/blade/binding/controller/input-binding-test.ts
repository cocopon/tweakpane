import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ReadWriteBinding} from '../../../common/binding/read-write.js';
import {BindingTarget} from '../../../common/binding/target.js';
import {InputBindingValue} from '../../../common/binding/value/input-binding.js';
import {TextController} from '../../../common/controller/text.js';
import {
	createNumberFormatter,
	parseNumber,
} from '../../../common/converter/number.js';
import {LabelPropsObject} from '../../../common/label/view/label.js';
import {ValueMap} from '../../../common/model/value-map.js';
import {createValue} from '../../../common/model/values.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {PointAxis} from '../../../common/point-nd/point-axis.js';
import {colorFromRgbNumber} from '../../../input-binding/color/converter/color-number.js';
import {
	colorToHexRgbString,
	createColorStringParser,
} from '../../../input-binding/color/converter/color-string.js';
import {createColorNumberWriter} from '../../../input-binding/color/converter/writer.js';
import {IntColor} from '../../../input-binding/color/model/int-color.js';
import {Point2dController} from '../../../input-binding/point-2d/controller/point-2d.js';
import {
	point2dFromUnknown,
	writePoint2d,
} from '../../../input-binding/point-2d/converter/point-2d.js';
import {Point2d} from '../../../input-binding/point-2d/model/point-2d.js';
import {createTestWindow} from '../../../misc/dom-test-util.js';
import {InputBindingController} from '../../binding/controller/input-binding.js';
import {createBlade} from '../../common/model/blade.js';

function createColorController(doc: Document) {
	const obj = {
		foo: 0x112233,
	};
	const binding = new ReadWriteBinding({
		reader: colorFromRgbNumber,
		target: new BindingTarget(obj, 'foo'),
		writer: createColorNumberWriter(false),
	});
	const value = new InputBindingValue(
		createValue(new IntColor([0, 0, 0], 'rgb')),
		binding,
	);
	const vc = new TextController<IntColor>(doc, {
		parser: createColorStringParser('int'),
		props: ValueMap.fromObject({
			formatter: (v) => colorToHexRgbString(v, '0x'),
		}),
		value: value,
		viewProps: ViewProps.create(),
	});
	const c = new InputBindingController<IntColor>(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: 'foo',
		}),
		value: value,
		valueController: vc,
	});
	return {
		controller: c,
		object: obj,
	};
}

class Vector2 {
	public x: number;
	public y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public toArray(): [number, number] {
		return [this.x, this.y];
	}
}

function createPoint2dController(doc: Document) {
	const obj = {
		foo: new Vector2(1, 2),
	};
	const binding = new ReadWriteBinding({
		reader: point2dFromUnknown,
		target: new BindingTarget(obj, 'foo'),
		writer: writePoint2d,
	});
	const value = new InputBindingValue(createValue(new Point2d(0, 0)), binding);
	const axis: PointAxis = {
		constraint: undefined,
		textProps: ValueMap.fromObject({
			formatter: createNumberFormatter(1),
			keyScale: 1,
			pointerScale: 1,
		}),
	};
	const vc = new Point2dController(doc, {
		axes: [axis, axis],
		expanded: false,
		invertsY: false,
		max: 1,
		parser: parseNumber,
		pickerLayout: 'popup',
		value: value,
		viewProps: ViewProps.create(),
	});
	const c = new InputBindingController<Point2d>(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: 'foo',
		}),
		value: value,
		valueController: vc,
	});
	return {
		controller: c,
		object: obj,
	};
}

describe(InputBindingController.name, () => {
	it('should import state', () => {
		const doc = createTestWindow().document;
		const {controller: bc} = createColorController(doc);

		assert.strictEqual(
			bc.importState({
				binding: {
					value: 0x445566,
				},
				disabled: true,
				hidden: true,
				label: 'bar',
			}),
			true,
		);
		assert.deepStrictEqual(
			bc.value.rawValue.getComponents(),
			[0x44, 0x55, 0x66, 1],
		);
	});

	it('should not break bound value', () => {
		const doc = createTestWindow().document;
		const {controller: bc, object: obj} = createPoint2dController(doc);

		assert.strictEqual(
			bc.importState({
				binding: {
					value: {x: 3, y: 4},
				},
				disabled: true,
				hidden: true,
				label: 'bar',
			}),
			true,
		);
		assert.ok(obj.foo instanceof Vector2);
		assert.deepStrictEqual(obj.foo.toArray(), [3, 4]);
	});

	[
		{
			params: {
				controller: (doc: Document) => createColorController(doc),
				type: 'color',
			},
		},
		{
			params: {
				controller: (doc: Document) => createPoint2dController(doc),
				type: 'point2d',
			},
		},
	].forEach(({params}) => {
		describe(`when type=${JSON.stringify(params.type)}`, () => {
			it('should import exported state without error', () => {
				const doc = createTestWindow().document;
				const {controller: bc} = params.controller(doc);

				const state = bc.exportState();
				assert.doesNotThrow(() => {
					bc.importState(state);
				});
			});
		});
	});
});
