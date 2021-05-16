import * as assert from 'assert';
import {describe, it} from 'mocha';

import {InputBinding} from '../../../common/binding/input';
import {MonitorBinding} from '../../../common/binding/monitor';
import {BindingTarget} from '../../../common/binding/target';
import {ManualTicker} from '../../../common/binding/ticker/manual';
import {boolFromUnknown} from '../../../common/converter/boolean';
import {
	createNumberFormatter,
	parseNumber,
} from '../../../common/converter/number';
import {stringFromUnknown} from '../../../common/converter/string';
import {Buffer} from '../../../common/model/buffered-value';
import {ValueMap} from '../../../common/model/value-map';
import {createValue} from '../../../common/model/values';
import {ViewProps} from '../../../common/model/view-props';
import {SliderTextController} from '../../../common/number/controller/slider-text';
import {writePrimitive} from '../../../common/primitive';
import {CheckboxController} from '../../../input-binding/boolean/controller/checkbox';
import {createTestWindow} from '../../../misc/dom-test-util';
import {forceCast} from '../../../misc/type-util';
import {SingleLogController} from '../../../monitor-binding/common/controller/single-log';
import {FolderController} from '../../folder/controller/folder';
import {FolderPropsObject} from '../../folder/view/folder';
import {InputBindingController} from '../../input-binding/controller/input-binding';
import {LabeledValueController} from '../../label/controller/value-label';
import {LabelPropsObject, LabelView} from '../../label/view/label';
import {MonitorBindingController} from '../../monitor-binding/controller/monitor-binding';
import {ValueBladeController} from '../controller/value-blade';
import {createBlade} from './blade';
import {BladeRack} from './blade-rack';

function createInputBindingController(
	doc: Document,
): InputBindingController<boolean> {
	const b = new InputBinding({
		reader: boolFromUnknown,
		target: new BindingTarget({foo: false}, 'foo'),
		value: createValue(false),
		writer: writePrimitive,
	});
	return new InputBindingController(doc, {
		blade: createBlade(),
		binding: b,
		props: ValueMap.fromObject<LabelPropsObject>({
			label: '',
		}),
		valueController: new CheckboxController(doc, {
			value: b.value,
			viewProps: ViewProps.create(),
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
		value: createValue<Buffer<string>>([]),
	});
	return new MonitorBindingController(doc, {
		blade: createBlade(),
		binding: b,
		props: ValueMap.fromObject<LabelPropsObject>({
			label: '',
		}),
		valueController: new SingleLogController(doc, {
			formatter: (v) => String(v),
			value: b.value,
			viewProps: ViewProps.create(),
		}),
	});
}

function createValueBladeController(
	doc: Document,
): ValueBladeController<number, LabelView> {
	const v = createValue(123);
	return new LabeledValueController<number, SliderTextController>(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: '',
		}),
		valueController: new SliderTextController(doc, {
			baseStep: 1,
			parser: parseNumber,
			sliderProps: ValueMap.fromObject({
				maxValue: 100,
				minValue: 0,
			}),
			textProps: ValueMap.fromObject({
				draggingScale: 1,
				formatter: createNumberFormatter(2),
			}),
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

describe(BladeRack.name, () => {
	it('should be empty by default', () => {
		const rack = new BladeRack();
		assert.strictEqual(rack.children.length, 0);
	});

	it('should add blade', () => {
		const rack = new BladeRack();
		const doc = createTestWindow().document;
		const bc = createInputBindingController(doc);
		rack.add(bc);

		assert.strictEqual(rack.children[0], bc);
		assert.strictEqual(bc.parent, rack);
	});

	it('should remove blade', () => {
		const rack = new BladeRack();
		const doc = createTestWindow().document;
		const bc = createInputBindingController(doc);
		rack.add(bc);
		rack.remove(bc);

		assert.strictEqual(rack.children.length, 0);
		assert.strictEqual(bc.parent, null);
	});

	it('should handle input change', (done) => {
		const rack = new BladeRack();
		const doc = createTestWindow().document;
		const bc = createInputBindingController(doc);
		rack.add(bc);

		rack.emitter.on('inputchange', (ev) => {
			assert.strictEqual(ev.bladeController, forceCast(bc));
			done();
		});

		bc.binding.value.rawValue = !bc.binding.value.rawValue;
	});

	it('should handle input change (nested)', (done) => {
		const rack = new BladeRack();
		const doc = createTestWindow().document;
		const fc = createFolderController(doc);
		rack.add(fc);
		const bc = createInputBindingController(doc);
		fc.rackController.rack.add(bc);

		rack.emitter.on('inputchange', (ev) => {
			assert.strictEqual(ev.bladeController, forceCast(bc));
			done();
		});

		bc.binding.value.rawValue = !bc.binding.value.rawValue;
	});

	it('should handle input change (deep-nested)', (done) => {
		const rack = new BladeRack();
		const doc = createTestWindow().document;
		const fc = createFolderController(doc);
		rack.add(fc);
		const sfc = createFolderController(doc);
		fc.rackController.rack.add(sfc);
		const bc = createInputBindingController(doc);
		sfc.rackController.rack.add(bc);

		rack.emitter.on('inputchange', (ev) => {
			assert.strictEqual(ev.bladeController, forceCast(bc));
			done();
		});

		bc.binding.value.rawValue = !bc.binding.value.rawValue;
	});

	it('should handle monitor update', (done) => {
		const rack = new BladeRack();
		const doc = createTestWindow().document;
		const bc = createMonitorBindingController(doc);
		rack.add(bc);

		rack.emitter.on('monitorupdate', (ev) => {
			assert.strictEqual(ev.bladeController, forceCast(bc));
			done();
		});

		(bc.binding.ticker as ManualTicker).tick();
	});

	it('should handle monitor update (nested)', (done) => {
		const rack = new BladeRack();
		const doc = createTestWindow().document;
		const fc = createFolderController(doc);
		rack.add(fc);
		const bc = createMonitorBindingController(doc);
		fc.rackController.rack.add(bc);

		rack.emitter.on('monitorupdate', (ev) => {
			assert.strictEqual(ev.bladeController, forceCast(bc));
			done();
		});

		(bc.binding.ticker as ManualTicker).tick();
	});

	it('should handle value change', (done) => {
		const rack = new BladeRack();
		const doc = createTestWindow().document;
		const bc = createValueBladeController(doc);
		rack.add(bc);

		rack.emitter.on('inputchange', (ev) => {
			assert.strictEqual(ev.bladeController, forceCast(bc));
			done();
		});

		bc.value.rawValue += 1;
	});

	it('should handle value change (nested)', (done) => {
		const rack = new BladeRack();
		const doc = createTestWindow().document;
		const fc = createFolderController(doc);
		rack.add(fc);
		const bc = createValueBladeController(doc);
		fc.rackController.rack.add(bc);

		rack.emitter.on('inputchange', (ev) => {
			assert.strictEqual(ev.bladeController, forceCast(bc));
			done();
		});

		bc.value.rawValue += 1;
	});

	it('should remove disposed blade', () => {
		const rack = new BladeRack();
		const doc = createTestWindow().document;
		const bc = createInputBindingController(doc);
		rack.add(bc);

		assert.strictEqual(rack.children.includes(bc), true);
		bc.viewProps.set('disposed', true);
		assert.strictEqual(rack.children.includes(bc), false);
	});

	it('should handle layout', () => {
		const rack = new BladeRack();
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
		const rack = new BladeRack();
		const doc = createTestWindow().document;
		const bc = createInputBindingController(doc);
		rack.add(bc);

		rack.emitter.on('inputchange', () => {
			assert.fail('should not be called');
		});

		bc.viewProps.set('disposed', true);
		bc.binding.value.rawValue = !bc.binding.value.rawValue;
	});

	it('should not handle removed folder event', () => {
		const rack = new BladeRack();
		const doc = createTestWindow().document;
		const fc = createFolderController(doc);
		rack.add(fc);
		const bc = createInputBindingController(doc);
		fc.rackController.rack.add(bc);

		rack.emitter.on('inputchange', () => {
			assert.fail('should not be called');
		});

		fc.viewProps.set('disposed', true);
		bc.binding.value.rawValue = !bc.binding.value.rawValue;
	});

	it('should handle layout (nested)', () => {
		const rack = new BladeRack();
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
		const rack = new BladeRack();
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
		const rack1 = new BladeRack();
		const doc = createTestWindow().document;
		const bc = createInputBindingController(doc);
		rack1.add(bc);
		const rack2 = new BladeRack();
		rack2.add(bc);

		assert.strictEqual(rack1.children.length, 0);
		assert.strictEqual(rack2.children[0], bc);
		assert.strictEqual(bc.parent, rack2);
	});

	it('should update positions', () => {
		const rack = new BladeRack();
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
