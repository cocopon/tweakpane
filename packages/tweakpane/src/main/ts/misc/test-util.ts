import {
	BladeApi,
	BladeController,
	Controller,
	createBlade,
	createValue,
	forceCast,
	LabeledValueBladeController,
	LabelPropsObject,
	PlainView,
	SliderController,
	SliderPropsObject,
	ValueMap,
	ViewProps,
} from '@tweakpane/core';
import * as assert from 'assert';
import {JSDOM} from 'jsdom';

export function createTestWindow(): Window {
	return forceCast(new JSDOM('').window);
}

class LabelableController implements Controller {
	public readonly viewProps = ViewProps.create();
	public readonly view: PlainView;

	constructor(doc: Document) {
		this.view = new PlainView(doc, {
			viewName: '',
			viewProps: this.viewProps,
		});
	}
}

export function createEmptyLabelableController(doc: Document) {
	return new LabelableController(doc);
}

export function createLabeledValueBladeController(doc: Document) {
	const vc = new SliderController(doc, {
		props: ValueMap.fromObject<SliderPropsObject>({
			keyScale: 1,
			max: 1,
			min: 0,
		}),
		value: createValue(0),
		viewProps: ViewProps.create(),
	});
	return new LabeledValueBladeController(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({label: ''}),
		valueController: vc,
		value: vc.value,
	});
}

export function createEmptyBladeController(
	doc: Document,
): BladeController<PlainView> {
	return new BladeController({
		blade: createBlade(),
		view: new PlainView(doc, {
			viewName: '',
			viewProps: ViewProps.create(),
		}),
		viewProps: ViewProps.create(),
	});
}

export function assertInitialState(api: BladeApi) {
	assert.strictEqual(api.disabled, false);
	assert.strictEqual(api.hidden, false);
	assert.strictEqual(api.controller.viewProps.get('disposed'), false);
}

export function assertDisposes(api: BladeApi) {
	api.dispose();
	assert.strictEqual(api.controller.viewProps.get('disposed'), true);
}

export function assertUpdates(api: BladeApi) {
	api.disabled = true;
	assert.strictEqual(api.disabled, true);
	assert.strictEqual(
		api.controller.view.element.classList.contains('tp-v-disabled'),
		true,
	);

	api.hidden = true;
	assert.strictEqual(api.hidden, true);
	assert.strictEqual(
		api.controller.view.element.classList.contains('tp-v-hidden'),
		true,
	);
}
