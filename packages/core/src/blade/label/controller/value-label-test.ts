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
	label: string,
): LabeledValueController<number> {
	const value = createValue(0);
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
			label: label,
		}),
		value: value,
		valueController: controller,
	});
}

describe(LabeledValueController.name, () => {
	it('should get properties', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, 'foo');

		assert.strictEqual(c.props.get('label'), 'foo');
	});

	it('should apply properties to view', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, 'foo');

		assert.strictEqual(c.view.labelElement.textContent, 'foo');
	});

	it('should export state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, 'foo');

		const state = c.export();
		assert.ok('disabled' in state);
		assert.ok('hidden' in state);
		assert.strictEqual(state.label, 'foo');
	});

	it('should import state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, 'foo');
		c.import({
			disabled: true,
			hidden: true,
			label: 'bar',
		});

		assert.strictEqual(c.viewProps.get('disabled'), true);
		assert.strictEqual(c.viewProps.get('hidden'), true);
		assert.strictEqual(c.props.get('label'), 'bar');
	});
});
