import * as assert from 'assert';
import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {ButtonApi} from '../plugin/blade/button/api/button';
import {InputBindingController} from '../plugin/blade/common/controller/input-binding';
import {MonitorBindingController} from '../plugin/blade/common/controller/monitor-binding';
import {Blade} from '../plugin/blade/common/model/blade';
import {RootController} from '../plugin/blade/folder/root';
import {LabeledController} from '../plugin/blade/labeled/controller';
import {SeparatorApi} from '../plugin/blade/separator/api/separator';
import {SeparatorController} from '../plugin/blade/separator/controller';
import {createViewProps} from '../plugin/common/model/view-props';
import {RootApi} from './root';
import {TpFoldEvent} from './tp-event';

function createApi(): RootApi {
	const doc = TestUtil.createWindow().document;
	const c = new RootController(doc, {
		blade: new Blade(),
		title: 'Folder',
		viewProps: createViewProps(),
	});
	return new RootApi(c);
}

describe(RootApi.name, () => {
	it('should add button', () => {
		const api = createApi();
		const bapi = api.addButton({
			title: '',
		});
		assert.strictEqual(bapi instanceof ButtonApi, true);
	});

	it('should add separator', () => {
		const api = createApi();
		const s = api.addSeparator();
		assert.strictEqual(s instanceof SeparatorApi, true);

		const cs = api.controller_.bladeRack.items;
		assert.strictEqual(cs[cs.length - 1] instanceof SeparatorController, true);
	});

	it('should dispose separator', () => {
		const api = createApi();
		const cs = api.controller_.bladeRack.items;

		const s = api.addSeparator();
		assert.strictEqual(cs.length, 1);
		s.dispose();
		assert.strictEqual(cs.length, 0);
	});

	it('should add folder', () => {
		const pane = createApi();
		const f = pane.addFolder({
			title: 'folder',
		});
		assert.strictEqual(f.controller_.folder.title, 'folder');
		assert.strictEqual(f.controller_.folder.expanded, true);
	});

	it('should add collapsed folder', () => {
		const pane = createApi();
		const f = pane.addFolder({
			expanded: false,
			title: 'folder',
		});
		assert.strictEqual(f.controller_.folder.expanded, false);
	});

	it('should handle fold events (nested)', (done) => {
		const api = createApi();
		const f = api.addFolder({
			title: 'folder',
		});

		api.on('fold', (ev) => {
			assert.strictEqual(ev instanceof TpFoldEvent, true);
			assert.strictEqual(ev.expanded, false);
			done();
		});
		f.expanded = false;
	});

	it('should have right target (nested)', (done) => {
		const api = createApi();
		api.addButton({title: ''});
		const subapi = api.addFolder({title: ''});

		api.on('fold', (ev) => {
			assert.strictEqual(ev.target, subapi);
			done();
		});

		subapi.controller_.folder.expanded = !subapi.controller_.folder.expanded;
	});

	it('should dispose items (nested)', () => {
		const PARAMS = {foo: 1};
		const api = createApi();
		const f = api.addFolder({title: ''});
		const i = f.addInput(PARAMS, 'foo');
		const m = f.addMonitor(PARAMS, 'foo');

		assert.strictEqual(api.controller_.blade.disposed, false);
		assert.strictEqual(i.controller_.blade.disposed, false);
		assert.strictEqual(m.controller_.blade.disposed, false);
		api.dispose();
		assert.strictEqual(api.controller_.blade.disposed, true);
		assert.strictEqual(i.controller_.blade.disposed, true);
		assert.strictEqual(m.controller_.blade.disposed, true);
	});

	it('should have right target (nested)', (done) => {
		const api = createApi();
		api.addButton({title: ''});
		const subapi = api.addFolder({title: ''});

		api.on('fold', (ev) => {
			assert.strictEqual(ev.target, subapi);
			done();
		});

		subapi.controller_.folder.expanded = !subapi.controller_.folder.expanded;
	});

	[
		{
			insert: (api: RootApi, index: number) => {
				api.addInput({foo: 1}, 'foo', {index: index});
			},
			expected: InputBindingController,
		},
		{
			insert: (api: RootApi, index: number) => {
				api.addMonitor({foo: 1}, 'foo', {
					index: index,
					interval: 0,
				});
			},
			expected: MonitorBindingController,
		},
		{
			insert: (api: RootApi, index: number) => {
				api.addButton({index: index, title: 'button'});
			},
			expected: LabeledController,
		},
		{
			insert: (api: RootApi, index: number) => {
				api.addSeparator({
					index: index,
				});
			},
			expected: SeparatorController,
		},
	].forEach((testCase) => {
		context(`when ${testCase.expected.name}`, () => {
			it('should insert input/monitor into specified position', () => {
				const params = {
					bar: 2,
					foo: 1,
				};
				const api = createApi();
				api.addInput(params, 'foo');
				api.addInput(params, 'bar');
				testCase.insert(api, 1);

				const cs = api.controller_.bladeRack.items;
				assert.strictEqual(cs[1] instanceof testCase.expected, true);
			});
		});
	});
});
