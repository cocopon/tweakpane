import * as assert from 'assert';
import {describe, it} from 'mocha';

import {TextController} from '../../../common/controller/text.js';
import {ValueController} from '../../../common/controller/value.js';
import {
	createNumberFormatter,
	parseNumber,
} from '../../../common/converter/number.js';
import {LabelPropsObject} from '../../../common/label/view/label.js';
import {Value} from '../../../common/model/value.js';
import {ValueMap} from '../../../common/model/value-map.js';
import {createValue} from '../../../common/model/values.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {PlainView} from '../../../common/view/plain.js';
import {createTestWindow} from '../../../misc/dom-test-util.js';
import {BladeController} from '../../common/controller/blade.js';
import {
	BladeState,
	exportBladeState,
	importBladeState,
	PropsPortable,
} from '../../common/controller/blade-state.js';
import {createBlade} from '../../common/model/blade.js';
import {LabeledValueBladeController} from './value.js';

function createController(
	doc: Document,
	config: {
		label: string;
		value: number;
	},
): LabeledValueBladeController<number> {
	const value = createValue(config.value);
	const controller = new TextController(doc, {
		parser: parseNumber,
		props: ValueMap.fromObject({
			formatter: createNumberFormatter(0),
		}),
		value: value,
		viewProps: ViewProps.create(),
	});
	return new LabeledValueBladeController<number>(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: config.label,
		}),
		value: value,
		valueController: controller,
	});
}

class TestPortableValueController
	extends BladeController
	implements ValueController<number>, PropsPortable
{
	public readonly value: Value<number>;
	public opacity = 0;

	constructor(doc: Document, value: Value<number>) {
		const viewProps = ViewProps.create();
		super({
			blade: createBlade(),
			view: new PlainView(doc, {
				viewName: '',
				viewProps: viewProps,
			}),
			viewProps: viewProps,
		});
		this.value = value;
	}

	public importProps(state: BladeState): boolean {
		return importBladeState(
			state,
			null,
			(p) => ({
				opacity: p.required.number,
			}),
			(result) => {
				this.opacity = result.opacity;
				return true;
			},
		);
	}

	public exportProps(): BladeState {
		return exportBladeState(null, {
			opacity: this.opacity,
		});
	}
}

describe(LabeledValueBladeController.name, () => {
	it('should get properties', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, {
			label: 'foo',
			value: 0,
		});

		assert.strictEqual(c.labelController.props.get('label'), 'foo');
	});

	it('should apply properties to view', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, {
			label: 'foo',
			value: 0,
		});

		assert.strictEqual(c.view.labelElement.textContent, 'foo');
	});

	it('should export state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, {
			label: 'foo',
			value: 123,
		});

		const state = c.exportState();
		assert.ok('disabled' in state);
		assert.ok('hidden' in state);
		assert.strictEqual(state.label, 'foo');
		assert.strictEqual(state.value, 123);
	});

	it('should import state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, {
			label: 'foo',
			value: 0,
		});

		assert.strictEqual(
			c.importState({
				disabled: true,
				hidden: true,
				label: 'bar',
				value: 123,
			}),
			true,
		);
		assert.strictEqual(c.labelController.props.get('label'), 'bar');
		assert.strictEqual(c.value.rawValue, 123);
	});

	it('should import state without value', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, {
			label: 'foo',
			value: 123,
		});

		assert.strictEqual(
			c.importState({
				disabled: true,
				hidden: true,
				label: 'bar',
			}),
			true,
		);
	});

	it('should apply imported state to value controller', () => {
		const doc = createTestWindow().document;
		const value = createValue(0);
		const c = new LabeledValueBladeController<
			number,
			TestPortableValueController
		>(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: 'label',
			}),
			value: value,
			valueController: new TestPortableValueController(doc, value),
		});

		assert.strictEqual(
			c.importState({
				disabled: false,
				hidden: false,
				label: 'label',
				value: 0,

				opacity: 0.75,
			}),
			true,
		);
		assert.strictEqual(c.valueController.opacity, 0.75);
	});

	it('should export value controller state', () => {
		const doc = createTestWindow().document;
		const value = createValue(0);
		const c = new LabeledValueBladeController<
			number,
			TestPortableValueController
		>(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: 'label',
			}),
			value: value,
			valueController: new TestPortableValueController(doc, value),
		});
		c.valueController.opacity = 0.25;

		assert.deepStrictEqual(c.exportState(), {
			disabled: false,
			hidden: false,
			label: 'label',
			value: 0,

			opacity: 0.25,
		});
	});
});
