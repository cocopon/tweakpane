import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ReadWriteBinding} from '../../../common/binding/read-write.js';
import {ReadonlyBinding} from '../../../common/binding/readonly.js';
import {BindingTarget} from '../../../common/binding/target.js';
import {ManualTicker} from '../../../common/binding/ticker/manual.js';
import {InputBindingValue} from '../../../common/binding/value/input-binding.js';
import {MonitorBindingValue} from '../../../common/binding/value/monitor-binding.js';
import {ValueController} from '../../../common/controller/value.js';
import {boolFromUnknown} from '../../../common/converter/boolean.js';
import {
	createNumberFormatter,
	parseNumber,
} from '../../../common/converter/number.js';
import {stringFromUnknown} from '../../../common/converter/string.js';
import {LabelPropsObject, LabelView} from '../../../common/label/view/label.js';
import {ValueMap} from '../../../common/model/value-map.js';
import {createValue} from '../../../common/model/values.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {
	createSliderTextProps,
	SliderTextController,
} from '../../../common/number/controller/slider-text.js';
import {writePrimitive} from '../../../common/primitive.js';
import {CheckboxController} from '../../../input-binding/boolean/controller/checkbox.js';
import {createTestWindow} from '../../../misc/dom-test-util.js';
import {forceCast} from '../../../misc/type-util.js';
import {SingleLogController} from '../../../monitor-binding/common/controller/single-log.js';
import {InputBindingController} from '../../binding/controller/input-binding.js';
import {MonitorBindingController} from '../../binding/controller/monitor-binding.js';
import {FolderController} from '../../folder/controller/folder.js';
import {FolderPropsObject} from '../../folder/view/folder.js';
import {LabeledValueBladeController} from '../../label/controller/value.js';
import {BladeController} from '../controller/blade.js';
import {createBlade} from './blade.js';
import {Rack} from './rack.js';

function createInputBindingController(
	doc: Document,
): InputBindingController<boolean> {
	const b = new ReadWriteBinding({
		reader: boolFromUnknown,
		target: new BindingTarget({foo: false}, 'foo'),
		writer: writePrimitive,
	});
	const v = new InputBindingValue(createValue(false), b);
	return new InputBindingController(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: '',
		}),
		value: v,
		valueController: new CheckboxController(doc, {
			value: v,
			viewProps: ViewProps.create(),
		}),
	});
}

function createMonitorBindingController(
	doc: Document,
): MonitorBindingController<string> {
	const v = new MonitorBindingValue({
		binding: new ReadonlyBinding({
			reader: stringFromUnknown,
			target: new BindingTarget({foo: false}, 'foo'),
		}),
		bufferSize: 1,
		ticker: new ManualTicker(),
	});
	return new MonitorBindingController(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: '',
		}),
		value: v,
		valueController: new SingleLogController(doc, {
			formatter: (v) => String(v),
			value: v,
			viewProps: ViewProps.create(),
		}),
	});
}

function createValueBladeController(
	doc: Document,
): BladeController<LabelView> & ValueController<number> {
	const v = createValue(123);
	return new LabeledValueBladeController<number, SliderTextController>(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: '',
		}),
		value: v,
		valueController: new SliderTextController(doc, {
			...createSliderTextProps({
				formatter: createNumberFormatter(2),
				max: createValue(100),
				min: createValue(0),
				keyScale: createValue(1),
				pointerScale: 1,
			}),
			parser: parseNumber,
			value: v,
			viewProps: ViewProps.create(),
		}),
	});
}

function createFolderController(doc: Document): FolderController {
	return new FolderController(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<FolderPropsObject>({
			title: 'folder',
		}),
		viewProps: ViewProps.create(),
	});
}

describe(Rack.name, () => {
	it('should be empty by default', () => {
		const rack = new Rack({
			viewProps: ViewProps.create({}),
		});
		assert.strictEqual(rack.children.length, 0);
	});

	it('should add blade', () => {
		const rack = new Rack({
			viewProps: ViewProps.create({}),
		});
		const doc = createTestWindow().document;
		const bc = createInputBindingController(doc);
		rack.add(bc);

		assert.strictEqual(rack.children[0], bc);
		assert.strictEqual(bc.parent, rack);
	});

	it('should remove blade', () => {
		const rack = new Rack({
			viewProps: ViewProps.create({}),
		});
		const doc = createTestWindow().document;
		const bc = createInputBindingController(doc);
		rack.add(bc);
		rack.remove(bc);

		assert.strictEqual(rack.children.length, 0);
		assert.strictEqual(bc.parent, null);
	});

	it('should handle input change', (done) => {
		const rack = new Rack({
			viewProps: ViewProps.create({}),
		});
		const doc = createTestWindow().document;
		const bc = createInputBindingController(doc);
		rack.add(bc);

		rack.emitter.on('valuechange', (ev) => {
			assert.strictEqual(ev.bladeController, forceCast(bc));
			done();
		});

		bc.value.rawValue = !bc.value.rawValue;
	});

	it('should handle input change (nested)', (done) => {
		const rack = new Rack({
			viewProps: ViewProps.create({}),
		});
		const doc = createTestWindow().document;
		const fc = createFolderController(doc);
		rack.add(fc);
		const bc = createInputBindingController(doc);
		fc.rackController.rack.add(bc);

		rack.emitter.on('valuechange', (ev) => {
			assert.strictEqual(ev.bladeController, forceCast(bc));
			done();
		});

		bc.value.rawValue = !bc.value.rawValue;
	});

	it('should handle input change (deep-nested)', (done) => {
		const rack = new Rack({
			viewProps: ViewProps.create({}),
		});
		const doc = createTestWindow().document;
		const fc = createFolderController(doc);
		rack.add(fc);
		const sfc = createFolderController(doc);
		fc.rackController.rack.add(sfc);
		const bc = createInputBindingController(doc);
		sfc.rackController.rack.add(bc);

		rack.emitter.on('valuechange', (ev) => {
			assert.strictEqual(ev.bladeController, forceCast(bc));
			done();
		});

		bc.value.rawValue = !bc.value.rawValue;
	});

	it('should handle monitor update', (done) => {
		const rack = new Rack({
			viewProps: ViewProps.create({}),
		});
		const doc = createTestWindow().document;
		const bc = createMonitorBindingController(doc);
		rack.add(bc);

		rack.emitter.on('valuechange', (ev) => {
			assert.strictEqual(ev.bladeController, forceCast(bc));
			done();
		});

		(bc.value.ticker as ManualTicker).tick();
	});

	it('should handle monitor update (nested)', (done) => {
		const rack = new Rack({
			viewProps: ViewProps.create({}),
		});
		const doc = createTestWindow().document;
		const fc = createFolderController(doc);
		rack.add(fc);
		const bc = createMonitorBindingController(doc);
		fc.rackController.rack.add(bc);

		rack.emitter.on('valuechange', (ev) => {
			assert.strictEqual(ev.bladeController, forceCast(bc));
			done();
		});

		(bc.value.ticker as ManualTicker).tick();
	});

	it('should handle value change', (done) => {
		const rack = new Rack({
			viewProps: ViewProps.create({}),
		});
		const doc = createTestWindow().document;
		const bc = createValueBladeController(doc);
		rack.add(bc);

		rack.emitter.on('valuechange', (ev) => {
			assert.strictEqual(ev.bladeController, forceCast(bc));
			done();
		});

		bc.value.rawValue += 1;
	});

	it('should handle value change (nested)', (done) => {
		const rack = new Rack({
			viewProps: ViewProps.create({}),
		});
		const doc = createTestWindow().document;
		const fc = createFolderController(doc);
		rack.add(fc);
		const bc = createValueBladeController(doc);
		fc.rackController.rack.add(bc);

		rack.emitter.on('valuechange', (ev) => {
			assert.strictEqual(ev.bladeController, forceCast(bc));
			done();
		});

		bc.value.rawValue += 1;
	});

	it('should remove disposed blade', () => {
		const rack = new Rack({
			viewProps: ViewProps.create({}),
		});
		const doc = createTestWindow().document;
		const bc = createInputBindingController(doc);
		rack.add(bc);

		assert.strictEqual(rack.children.includes(bc), true);
		bc.viewProps.set('disposed', true);
		assert.strictEqual(rack.children.includes(bc), false);
	});

	it('should handle layout', () => {
		const rack = new Rack({
			viewProps: ViewProps.create({}),
		});
		const doc = createTestWindow().document;
		const bc = createInputBindingController(doc);
		rack.add(bc);

		let count = 0;
		rack.emitter.on('layout', (ev) => {
			assert.strictEqual(ev.sender, rack);
			count += 1;
		});

		bc.viewProps.set('hidden', !bc.viewProps.get('hidden'));
		assert.strictEqual(count > 0, true);
	});

	it('should not handle removed input event', () => {
		const rack = new Rack({
			viewProps: ViewProps.create({}),
		});
		const doc = createTestWindow().document;
		const bc = createInputBindingController(doc);
		rack.add(bc);

		rack.emitter.on('valuechange', () => {
			assert.fail('should not be called');
		});

		bc.viewProps.set('disposed', true);
		bc.value.rawValue = !bc.value.rawValue;
	});

	it('should not handle removed folder event', () => {
		const rack = new Rack({
			viewProps: ViewProps.create({}),
		});
		const doc = createTestWindow().document;
		const fc = createFolderController(doc);
		rack.add(fc);
		const bc = createInputBindingController(doc);
		fc.rackController.rack.add(bc);

		rack.emitter.on('valuechange', () => {
			assert.fail('should not be called');
		});

		fc.viewProps.set('disposed', true);
		bc.value.rawValue = !bc.value.rawValue;
	});

	it('should handle layout (nested)', () => {
		const rack = new Rack({
			viewProps: ViewProps.create({}),
		});
		const doc = createTestWindow().document;
		const fc = createFolderController(doc);
		rack.add(fc);
		const bc = createInputBindingController(doc);
		fc.rackController.rack.add(bc);

		let count = 0;
		rack.emitter.on('layout', () => {
			count += 1;
		});
		bc.viewProps.set('hidden', !bc.viewProps.get('hidden'));

		assert.strictEqual(count > 0, true);
	});

	it('should move to the last when re-adding child', () => {
		const rack = new Rack({
			viewProps: ViewProps.create({}),
		});
		const doc = createTestWindow().document;
		const bc = createInputBindingController(doc);
		rack.add(bc);
		rack.add(createFolderController(doc));
		rack.add(bc);

		assert.strictEqual(rack.children.length, 2);
		assert.notStrictEqual(rack.children[0], bc);
		assert.strictEqual(rack.children[1], bc);
	});

	it('should be removed from previous parent', () => {
		const rack1 = new Rack({
			viewProps: ViewProps.create({}),
		});
		const doc = createTestWindow().document;
		const bc = createInputBindingController(doc);
		rack1.add(bc);
		const rack2 = new Rack({
			viewProps: ViewProps.create({}),
		});
		rack2.add(bc);

		assert.strictEqual(rack1.children.length, 0);
		assert.strictEqual(rack2.children[0], bc);
		assert.strictEqual(bc.parent, rack2);
	});

	it('should update positions', () => {
		const rack = new Rack({
			viewProps: ViewProps.create({}),
		});
		const doc = createTestWindow().document;

		const f1 = createFolderController(doc);
		rack.add(f1);
		f1.rackController.rack.add(createInputBindingController(doc));
		f1.rackController.rack.add(createInputBindingController(doc));

		const f2 = createFolderController(doc);
		rack.add(f2);
		f2.rackController.rack.add(createInputBindingController(doc));
		f2.rackController.rack.add(createInputBindingController(doc));

		const f3 = createFolderController(doc);
		rack.add(f3);
		f3.rackController.rack.add(createInputBindingController(doc));
		f3.rackController.rack.add(createInputBindingController(doc));

		const sf3 = createFolderController(doc);
		f3.rackController.rack.add(sf3);
		sf3.rackController.rack.add(createInputBindingController(doc));

		function folderChildPos(f: FolderController, index: number) {
			return f.rackController.rack.children[index].blade.get('positions');
		}

		assert.deepStrictEqual(f1.blade.get('positions'), ['first', 'veryfirst']);
		assert.deepStrictEqual(folderChildPos(f1, 0), ['first', 'veryfirst']);
		assert.deepStrictEqual(folderChildPos(f1, 1), ['last']);
		assert.deepStrictEqual(f2.blade.get('positions'), []);
		assert.deepStrictEqual(folderChildPos(f2, 0), ['first']);
		assert.deepStrictEqual(folderChildPos(f2, 1), ['last']);
		assert.deepStrictEqual(f3.blade.get('positions'), ['last', 'verylast']);
		assert.deepStrictEqual(folderChildPos(f3, 0), ['first']);
		assert.deepStrictEqual(sf3.blade.get('positions'), ['last', 'verylast']);
		assert.deepStrictEqual(folderChildPos(sf3, 0), [
			'first',
			'last',
			'verylast',
		]);
	});
});
