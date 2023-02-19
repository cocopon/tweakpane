import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {createTestWindow} from '../../../misc/dom-test-util';
import {createBlade} from '../../common/model/blade';
import {LabelPropsObject} from '../../label/view/label';
import {ButtonPropsObject} from '../view/button';
import {ButtonController} from './button';
import {LabeledButtonController} from './labeled-button';

function createController(
	doc: Document,
	config: {
		label: string;
		title: string;
	},
) {
	return new LabeledButtonController(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: config.label,
		}),
		valueController: new ButtonController(doc, {
			props: ValueMap.fromObject<ButtonPropsObject>({
				title: config.title,
			}),
			viewProps: ViewProps.create(),
		}),
	});
}

describe(LabeledButtonController.name, () => {
	it('should export state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, {
			label: 'foo',
			title: 'bar',
		});

		const state = c.export();
		assert.ok('disabled' in state);
		assert.ok('hidden' in state);
		assert.strictEqual(state.label, 'foo');
		assert.strictEqual(state.title, 'bar');
	});

	it('should import state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, {
			label: 'foo',
			title: 'bar',
		});
		c.import({
			disabled: true,
			hidden: true,
			label: 'baz',
			title: 'qux',
		});

		assert.strictEqual(c.viewProps.get('disabled'), true);
		assert.strictEqual(c.viewProps.get('hidden'), true);
		assert.strictEqual(c.props.get('label'), 'baz');
		assert.strictEqual(c.valueController.props.get('title'), 'qux');
	});
});
