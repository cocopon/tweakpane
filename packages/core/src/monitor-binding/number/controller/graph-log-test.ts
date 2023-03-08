import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createNumberFormatter} from '../../../common/converter/number';
import {initializeBuffer} from '../../../common/model/buffered-value';
import {ValueMap} from '../../../common/model/value-map';
import {createValue} from '../../../common/model/values';
import {ViewProps} from '../../../common/model/view-props';
import {createTestWindow} from '../../../misc/dom-test-util';
import {GraphLogController} from './graph-log';

function createController(
	doc: Document,
	config: {
		max: number;
		min: number;
	},
) {
	return new GraphLogController(doc, {
		formatter: createNumberFormatter(1),
		props: ValueMap.fromObject({
			max: config.max,
			min: config.min,
		}),
		rows: 1,
		value: createValue(initializeBuffer(1)),
		viewProps: ViewProps.create(),
	});
}

describe(GraphLogController.name, () => {
	it('should export props', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, {
			max: 1,
			min: 0,
		});

		assert.deepStrictEqual(c.exportProps(), {
			max: 1,
			min: 0,
		});
	});

	it('should import props', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, {
			max: 1,
			min: 0,
		});

		assert.strictEqual(
			c.importProps({
				max: 100,
				min: 50,
			}),
			true,
		);
		assert.strictEqual(c.props.get('max'), 100);
		assert.strictEqual(c.props.get('min'), 50);
	});
});
