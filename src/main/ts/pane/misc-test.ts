import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {TypeUtil} from '../misc/type-util';
import {InputValue} from '../model/input-value';
import {PlainTweakpane} from './plain-tweakpane';

function createPane(): PlainTweakpane {
	return new PlainTweakpane({
		document: TestUtil.createWindow().document,
		title: 'Tweakpane',
	});
}

describe(PlainTweakpane.name, () => {
	it('should handle global input events', (done) => {
		const pane = createPane();
		const obj = {foo: 1};
		pane.on('change', (v: unknown) => {
			assert.strictEqual(v, 2);
			done();
		});

		const bapi = pane.addInput(obj, 'foo');
		const value: InputValue<number> = TypeUtil.forceCast(
			bapi.controller.binding.value,
		);
		value.rawValue += 1;
	});

	it('should handle global input events (nested)', (done) => {
		const pane = createPane();
		const obj = {foo: 1};
		pane.on('change', (v: unknown) => {
			assert.strictEqual(v, 2);
			done();
		});

		const fapi = pane.addFolder({
			title: 'foo',
		});

		const bapi = fapi.addInput(obj, 'foo');
		const value: InputValue<number> = TypeUtil.forceCast(
			bapi.controller.binding.value,
		);
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
		assert.strictEqual(m1.controller.binding.value.rawValue.values[0], 456);
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
		assert.exists(pane.element);
	});

	it('should hide', () => {
		const pane = createPane();
		assert.strictEqual(pane.hidden, false);

		pane.hidden = true;
		assert.isTrue(
			pane.controller.view.element.classList.contains('tp-v-hidden'),
		);
	});
});
