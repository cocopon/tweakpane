import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {InputBindingController} from '../blade/common/controller/input-binding';
import {MonitorBindingController} from '../blade/common/controller/monitor-binding';
import {FolderController} from '../blade/folder/controller/folder';
import {LabeledController} from '../blade/labeled/controller/labeled';
import {SeparatorController} from '../blade/separator/controller/separator';
import Tweakpane from '../index';
import {TestUtil} from '../misc/test-util';
import {Class} from '../misc/type-util';

function createApi(title?: string): Tweakpane {
	return new Tweakpane({
		document: TestUtil.createWindow().document,
		title: title,
	});
}

describe(Tweakpane.name, () => {
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
			expected: LabeledController,
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
		insert: (api: Tweakpane, index: number) => void;
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

				const cs = pane.controller_.bladeRack.children;
				assert.strictEqual(cs[1] instanceof testCase.expected, true);
			});
		});
	});
});
