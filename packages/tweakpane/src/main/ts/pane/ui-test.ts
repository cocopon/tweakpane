import {
	ButtonBladeController,
	Class,
	FolderController,
	LabeledValueBladeController,
} from '@tweakpane/core';
import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {createTestWindow} from '../misc/test-util.js';
import {Pane} from './pane.js';

function createApi(title?: string): Pane {
	return new Pane({
		document: createTestWindow().document,
		title: title,
	});
}

describe(Pane.name, () => {
	(
		[
			{
				insert: (api, index) => {
					api.addBinding({foo: 1}, 'foo', {index: index});
				},
				expected: LabeledValueBladeController,
			},
			{
				insert: (api, index) => {
					api.addBinding({foo: 1}, 'foo', {
						index: index,
						interval: 0,
						readonly: true,
					});
				},
				expected: LabeledValueBladeController,
			},
			{
				insert: (api, index) => {
					api.addButton({index: index, title: 'button'});
				},
				expected: ButtonBladeController,
			},
			{
				insert: (api, index) => {
					api.addFolder({index: index, title: 'folder'});
				},
				expected: FolderController,
			},
		] as {
			insert: (api: Pane, index: number) => void;
			expected: Class<any>;
		}[]
	).forEach((testCase) => {
		context(`when ${testCase.expected.name}`, () => {
			it('should insert input/monitor into specified position', () => {
				const params = {
					bar: 2,
					foo: 1,
				};
				const pane = createApi();
				pane.addBinding(params, 'foo');
				pane.addBinding(params, 'bar');
				testCase.insert(pane, 1);

				const cs = pane.controller.rackController.rack.children;
				assert.strictEqual(cs[1] instanceof testCase.expected, true);
			});
		});
	});
});
