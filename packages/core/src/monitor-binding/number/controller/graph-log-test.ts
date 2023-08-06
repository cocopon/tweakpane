import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createNumberFormatter} from '../../../common/converter/number.js';
import {initializeBuffer} from '../../../common/model/buffered-value.js';
import {ValueMap} from '../../../common/model/value-map.js';
import {createValue} from '../../../common/model/values.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {createTestWindow} from '../../../misc/dom-test-util.js';
import {GraphLogController} from './graph-log.js';

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
