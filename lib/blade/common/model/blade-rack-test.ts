import * as assert from 'assert';
import {describe, it} from 'mocha';

import {InputBinding} from '../../../common/binding/input';
import {MonitorBinding} from '../../../common/binding/monitor';
import {BindingTarget} from '../../../common/binding/target';
import {ManualTicker} from '../../../common/binding/ticker/manual';
import {boolFromUnknown} from '../../../common/converter/boolean';
import {stringFromUnknown} from '../../../common/converter/string';
import {BoundValue} from '../../../common/model/bound-value';
import {Buffer} from '../../../common/model/buffered-value';
import {ValueMap} from '../../../common/model/value-map';
import {createViewProps} from '../../../common/model/view-props';
import {writePrimitive} from '../../../common/primitive';
import {CheckboxController} from '../../../input-binding/boolean/controller/checkbox';
import {TestUtil} from '../../../misc/test-util';
import {forceCast} from '../../../misc/type-util';
import {SingleLogMonitorController} from '../../../monitor-binding/common/controller/single-log';
import {FolderController} from '../../folder/controller/folder';
import {LabeledPropsObject} from '../../labeled/view/labeled';
import {InputBindingController} from '../controller/input-binding';
import {MonitorBindingController} from '../controller/monitor-binding';
import {Blade} from './blade';
import {BladeRack} from './blade-rack';

function createInputBindingController(
	doc: Document,
): InputBindingController<boolean> {
	const b = new InputBinding({
		reader: boolFromUnknown,
		target: new BindingTarget({foo: false}, 'foo'),
		value: new BoundValue(false),
		writer: writePrimitive,
	});
	return new InputBindingController(doc, {
		blade: new Blade(),
		binding: b,
		props: new ValueMap({
			label: '',
		} as LabeledPropsObject),
		valueController: new CheckboxController(doc, {
			value: b.value,
			viewProps: createViewProps(),
		}),
	});
}

function createMonitorBindingController(
	doc: Document,
): MonitorBindingController<string> {
	const b = new MonitorBinding({
		reader: stringFromUnknown,
		target: new BindingTarget({foo: false}, 'foo'),
		ticker: new ManualTicker(),
		value: new BoundValue<Buffer<string>>([]),
	});
	return new MonitorBindingController(doc, {
		blade: new Blade(),
		binding: b,
		props: new ValueMap({
			label: '',
		} as LabeledPropsObject),
		valueController: new SingleLogMonitorController(doc, {
			formatter: (v) => String(v),
			value: b.value,
			viewProps: createViewProps(),
		}),
	});
}

function createFolderController(doc: Document): FolderController {
	return new FolderController(doc, {
		blade: new Blade(),
		props: new ValueMap({
			title: 'folder' as string | undefined,
		}),
		viewProps: createViewProps(),
	});
}

describe(BladeRack.name, () => {
	it('should be empty by default', () => {
		const rack = new BladeRack();
		assert.strictEqual(rack.children.length, 0);
	});

	it('should add blade', () => {
		const rack = new BladeRack();
		const doc = TestUtil.createWindow().document;
		const bc = createInputBindingController(doc);
		rack.add(bc);

		assert.strictEqual(rack.children[0], bc);
		assert.strictEqual(bc.parent, rack);
	});

	it('should remove blade', () => {
		const rack = new BladeRack();
		const doc = TestUtil.createWindow().document;
		const bc = createInputBindingController(doc);
		rack.add(bc);
		rack.remove(bc);

		assert.strictEqual(rack.children.length, 0);
		assert.strictEqual(bc.parent, null);
	});

	it('should handle input change', (done) => {
		const rack = new BladeRack();
		const doc = TestUtil.createWindow().document;
		const bc = createInputBindingController(doc);
		rack.add(bc);

		rack.emitter.on('inputchange', (ev) => {
			assert.strictEqual(ev.bindingController, forceCast(bc));
			done();
		});

		bc.binding.value.rawValue = !bc.binding.value.rawValue;
	});

	it('should handle input change (nested)', (done) => {
		const rack = new BladeRack();
		const doc = TestUtil.createWindow().document;
		const fc = createFolderController(doc);
		rack.add(fc);
		const bc = createInputBindingController(doc);
		fc.bladeRack.add(bc);

		rack.emitter.on('inputchange', (ev) => {
			assert.strictEqual(ev.bindingController, forceCast(bc));
			done();
		});

		bc.binding.value.rawValue = !bc.binding.value.rawValue;
	});

	it('should handle input change (deep-nested)', (done) => {
		const rack = new BladeRack();
		const doc = TestUtil.createWindow().document;
		const fc = createFolderController(doc);
		rack.add(fc);
		const sfc = createFolderController(doc);
		fc.bladeRack.add(sfc);
		const bc = createInputBindingController(doc);
		sfc.bladeRack.add(bc);

		rack.emitter.on('inputchange', (ev) => {
			assert.strictEqual(ev.bindingController, forceCast(bc));
			done();
		});

		bc.binding.value.rawValue = !bc.binding.value.rawValue;
	});

	it('should handle monitor update', (done) => {
		const rack = new BladeRack();
		const doc = TestUtil.createWindow().document;
		const bc = createMonitorBindingController(doc);
		rack.add(bc);

		rack.emitter.on('monitorupdate', (ev) => {
			assert.strictEqual(ev.bindingController, forceCast(bc));
			done();
		});

		(bc.binding.ticker as ManualTicker).tick();
	});

	it('should handle monitor update (nested)', (done) => {
		const rack = new BladeRack();
		const doc = TestUtil.createWindow().document;
		const fc = createFolderController(doc);
		rack.add(fc);
		const bc = createMonitorBindingController(doc);
		fc.bladeRack.add(bc);

		rack.emitter.on('monitorupdate', (ev) => {
			assert.strictEqual(ev.bindingController, forceCast(bc));
			done();
		});

		(bc.binding.ticker as ManualTicker).tick();
	});

	it('should remove disposed blade', () => {
		const rack = new BladeRack();
		const doc = TestUtil.createWindow().document;
		const bc = createInputBindingController(doc);
		rack.add(bc);

		assert.strictEqual(rack.children.includes(bc), true);
		bc.blade.dispose();
		assert.strictEqual(rack.children.includes(bc), false);
	});

	it('should handle layout', (done) => {
		const rack = new BladeRack();
		const doc = TestUtil.createWindow().document;
		const bc = createInputBindingController(doc);
		rack.add(bc);

		rack.emitter.on('layout', (ev) => {
			assert.strictEqual(ev.sender, rack);
			done();
		});

		bc.viewProps.set('hidden', !bc.viewProps.get('hidden'));
	});

	it('should handle folder fold', (done) => {
		const rack = new BladeRack();
		const doc = TestUtil.createWindow().document;
		const fc = createFolderController(doc);
		rack.add(fc);

		rack.emitter.on('folderfold', (ev) => {
			assert.strictEqual(ev.folderController, fc);
			done();
		});

		fc.folder.expanded = !fc.folder.expanded;
	});

	it('should handle folder fold (nested)', (done) => {
		const rack = new BladeRack();
		const doc = TestUtil.createWindow().document;
		const fc = createFolderController(doc);
		rack.add(fc);
		const sfc = createFolderController(doc);
		fc.bladeRack.add(sfc);

		rack.emitter.on('folderfold', (ev) => {
			assert.strictEqual(ev.folderController, sfc);
			done();
		});

		sfc.folder.expanded = !sfc.folder.expanded;
	});

	it('should not handle removed input event', () => {
		const rack = new BladeRack();
		const doc = TestUtil.createWindow().document;
		const bc = createInputBindingController(doc);
		rack.add(bc);

		rack.emitter.on('inputchange', () => {
			assert.fail('should not be called');
		});

		bc.blade.dispose();
		bc.binding.value.rawValue = !bc.binding.value.rawValue;
	});

	it('should not handle removed folder event', () => {
		const rack = new BladeRack();
		const doc = TestUtil.createWindow().document;
		const fc = createFolderController(doc);
		rack.add(fc);
		const bc = createInputBindingController(doc);
		fc.bladeRack.add(bc);

		rack.emitter.on('inputchange', () => {
			assert.fail('should not be called');
		});

		fc.blade.dispose();
		bc.binding.value.rawValue = !bc.binding.value.rawValue;
	});

	it('should handle layout (nested)', () => {
		const rack = new BladeRack();
		const doc = TestUtil.createWindow().document;
		const fc = createFolderController(doc);
		rack.add(fc);
		const bc = createInputBindingController(doc);
		fc.bladeRack.add(bc);

		let count = 0;
		rack.emitter.on('layout', () => {
			count += 1;
		});
		bc.viewProps.set('hidden', !bc.viewProps.get('hidden'));

		assert.strictEqual(count > 0, true);
	});

	it('should move to the last when re-adding child', () => {
		const rack = new BladeRack();
		const doc = TestUtil.createWindow().document;
		const bc = createInputBindingController(doc);
		rack.add(bc);
		rack.add(createFolderController(doc));
		rack.add(bc);

		assert.strictEqual(rack.children.length, 2);
		assert.notStrictEqual(rack.children[0], bc);
		assert.strictEqual(rack.children[1], bc);
	});

	it('should be removed from previous parent', () => {
		const rack1 = new BladeRack();
		const doc = TestUtil.createWindow().document;
		const bc = createInputBindingController(doc);
		rack1.add(bc);
		const rack2 = new BladeRack();
		rack2.add(bc);

		assert.strictEqual(rack1.children.length, 0);
		assert.strictEqual(rack2.children[0], bc);
		assert.strictEqual(bc.parent, rack2);
	});
});
