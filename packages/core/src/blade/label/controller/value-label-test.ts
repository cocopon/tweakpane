import * as assert from 'assert';
import {describe, it} from 'mocha';

import {TextController} from '../../../common/controller/text';
import {
	createNumberFormatter,
	parseNumber,
} from '../../../common/converter/number';
import {ValueMap} from '../../../common/model/value-map';
import {createValue} from '../../../common/model/values';
import {ViewProps} from '../../../common/model/view-props';
import {createTestWindow} from '../../../misc/dom-test-util';
import {createBlade} from '../../common/model/blade';
import {LabelPropsObject} from '../view/label';
import {LabeledValueController} from './value-label';

function createController(
	doc: Document,
	config: {
		label: string;
		value: number;
	},
): LabeledValueController<number> {
	const value = createValue(config.value);
	const controller = new TextController(doc, {
		parser: parseNumber,
		props: ValueMap.fromObject({
			formatter: createNumberFormatter(0),
		}),
		value: value,
		viewProps: ViewProps.create(),
	});
	return new LabeledValueController<number>(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: config.label,
		}),
		value: value,
		valueController: controller,
	});
}

describe(LabeledValueController.name, () => {
	it('should get properties', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, {
			label: 'foo',
			value: 0,
		});

		assert.strictEqual(c.props.get('label'), 'foo');
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
		assert.strictEqual(c.props.get('label'), 'bar');
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
});
