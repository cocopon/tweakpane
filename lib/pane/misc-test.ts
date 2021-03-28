import * as assert from 'assert';
import {describe, it} from 'mocha';

import {InputBindingApi} from '../api/input-binding';
import {TpChangeEvent} from '../api/tp-event';
import Tweakpane from '../index';
import {TestUtil} from '../misc/test-util';
import {forceCast} from '../misc/type-util';
import {Value} from '../plugin/common/model/value';

function createPane(): Tweakpane {
	return new Tweakpane({
		document: TestUtil.createWindow().document,
		title: 'Tweakpane',
	});
}

describe(Tweakpane.name, () => {
	it('should handle global input events', (done) => {
		const pane = createPane();
		const obj = {foo: 1};
		const bapi = pane.addInput(obj, 'foo');

		pane.on('change', (ev) => {
			assert.strictEqual(ev instanceof TpChangeEvent, true);
			assert.strictEqual(ev.presetKey, 'foo');
			assert.strictEqual(ev.value, 2);

			if (!(ev.target instanceof InputBindingApi)) {
				throw new Error('unexpected target');
			}
			assert.strictEqual(ev.target.controller, bapi.controller);

			done();
		});

		const value: Value<number> = forceCast(bapi.controller.binding.value);
		value.rawValue += 1;
	});

	it('should handle global input events (nested)', (done) => {
		const pane = createPane();
		const obj = {foo: 1};
		const fapi = pane.addFolder({
			title: 'foo',
		});
		const bapi = fapi.addInput(obj, 'foo');

		pane.on('change', (ev) => {
			assert.strictEqual(ev instanceof TpChangeEvent, true);
			assert.strictEqual(ev.presetKey, 'foo');
			assert.strictEqual(ev.value, 2);

			if (!(ev.target instanceof InputBindingApi)) {
				throw new Error('unexpected target');
			}
			assert.strictEqual(ev.target.controller, bapi.controller);

			done();
		});

		const value: Value<number> = forceCast(bapi.controller.binding.value);
		value.rawValue += 1;
	});

	it('should refresh views', () => {
		const pane = createPane();
		const obj = {
			bar: 'bar',
			baz: 123,
			foo: 1,
		};
		const i1 = pane.addInput(obj, 'foo');
		const f = pane.addFolder({
			title: 'folder',
		});
		const i2 = f.addInput(obj, 'bar');
		const m1 = pane.addMonitor(obj, 'baz', {
			interval: 0,
		});

		obj.foo = 2;
		obj.bar = 'changed';
		obj.baz = 456;

		pane.refresh();

		assert.strictEqual(i1.controller.binding.value.rawValue, 2);
		assert.strictEqual(i2.controller.binding.value.rawValue, 'changed');
		assert.strictEqual(m1.controller.binding.value.rawValue[0], 456);
	});

	it('should get expanded', () => {
		const pane = createPane();
		const folder = pane.controller.folder;

		if (folder) {
			folder.expanded = false;
		}
		assert.strictEqual(pane.expanded, false);
		if (folder) {
			folder.expanded = true;
		}
		assert.strictEqual(pane.expanded, true);
	});

	it('should set expanded', () => {
		const pane = createPane();
		const folder = pane.controller.folder;

		pane.expanded = false;
		assert.strictEqual(folder && folder.expanded, false);
		pane.expanded = true;
		assert.strictEqual(folder && folder.expanded, true);
	});

	it('should export inputs as preset', () => {
		const PARAMS = {
			bar: 'hello',
			baz: 2,
			foo: 1,
		};
		const pane = createPane();
		pane.addInput(PARAMS, 'foo');
		pane.addInput(PARAMS, 'bar');
		pane.addMonitor(PARAMS, 'baz', {
			interval: 0,
		});
		const preset = pane.exportPreset();
		assert.deepStrictEqual(preset, {
			bar: 'hello',
			foo: 1,
		});
	});

	it('should import preset', () => {
		const PARAMS = {
			bar: 'hello',
			foo: 1,
		};
		const pane = createPane();
		pane.addInput(PARAMS, 'foo');
		pane.addInput(PARAMS, 'bar');

		pane.importPreset({
			bar: 'world',
			foo: 123,
		});

		assert.deepStrictEqual(PARAMS, {
			bar: 'world',
			foo: 123,
		});
	});

	it('should get element', () => {
		const pane = createPane();
		assert.ok(pane.element);
	});

	it('should hide', () => {
		const pane = createPane();
		assert.strictEqual(pane.hidden, false);

		pane.hidden = true;
		assert.strictEqual(
			pane.controller.view.element.classList.contains('tp-v-hidden'),
			true,
		);
	});
});
