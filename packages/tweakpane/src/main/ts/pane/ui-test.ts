import {
	Class,
	FolderController,
	InputBindingController,
	LabelController,
	MonitorBindingController,
	SeparatorController,
} from '@tweakpane/core';
import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {Pane} from '..';
import {createTestWindow} from '../misc/test-util';

function createApi(title?: string): Pane {
	return new Pane({
		document: createTestWindow().document,
		title: title,
	});
}

describe(Pane.name, () => {
	([
		{
			insert: (api, index) => {
				api.addInput({foo: 1}, 'foo', {index: index});
			},
			expected: InputBindingController,
		},
		{
			insert: (api, index) => {
				api.addMonitor({foo: 1}, 'foo', {
					index: index,
					interval: 0,
				});
			},
			expected: MonitorBindingController,
		},
		{
			insert: (api, index) => {
				api.addButton({index: index, title: 'button'});
			},
			expected: LabelController,
		},
		{
			insert: (api, index) => {
				api.addFolder({index: index, title: 'folder'});
			},
			expected: FolderController,
		},
		{
			insert: (api, index) => {
				api.addSeparator({
					index: index,
				});
			},
			expected: SeparatorController,
		},
	] as {
		insert: (api: Pane, index: number) => void;
		expected: Class<any>;
	}[]).forEach((testCase) => {
		context(`when ${testCase.expected.name}`, () => {
			it('should insert input/monitor into specified position', () => {
				const params = {
					bar: 2,
					foo: 1,
				};
				const pane = createApi();
				pane.addInput(params, 'foo');
				pane.addInput(params, 'bar');
				testCase.insert(pane, 1);

				const cs = pane.controller_.rackController.rack.children;
				assert.strictEqual(cs[1] instanceof testCase.expected, true);
			});
		});
	});
});
