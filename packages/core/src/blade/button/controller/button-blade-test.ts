import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {createTestWindow} from '../../../misc/dom-test-util';
import {createBlade} from '../../common/model/blade';
import {LabelPropsObject} from '../../label/view/label';
import {ButtonPropsObject} from '../view/button';
import {ButtonBladeController} from './button-blade';

function createController(
	doc: Document,
	config: {
		label: string;
		title: string;
	},
) {
	return new ButtonBladeController(doc, {
		blade: createBlade(),
		buttonProps: ValueMap.fromObject<ButtonPropsObject>({
			title: config.title,
		}),
		labelProps: ValueMap.fromObject<LabelPropsObject>({
			label: config.label,
		}),
		viewProps: ViewProps.create(),
	});
}

describe(ButtonBladeController.name, () => {
	it('should export state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, {
			label: 'foo',
			title: 'bar',
		});

		assert.deepStrictEqual(c.exportState(), {
			disabled: false,
			hidden: false,
			label: 'foo',
			title: 'bar',
		});
	});

	it('should import state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, {
			label: 'foo',
			title: 'bar',
		});

		assert.strictEqual(
			c.importState({
				disabled: true,
				hidden: true,
				label: 'baz',
				title: 'qux',
			}),
			true,
		);
		assert.strictEqual(c.buttonController.props.get('title'), 'qux');
		assert.strictEqual(c.labelController.props.get('label'), 'baz');
	});
});
