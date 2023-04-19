import {Controller} from '../common/controller/controller.js';
import {LabelPropsObject} from '../common/label/view/label.js';
import {parseRecord} from '../common/micro-parsers.js';
import {ValueMap} from '../common/model/value-map.js';
import {createValue} from '../common/model/values.js';
import {ViewProps} from '../common/model/view-props.js';
import {BaseBladeParams} from '../common/params.js';
import {TpError} from '../common/tp-error.js';
import {PlainView} from '../common/view/plain.js';
import {CheckboxController} from '../input-binding/boolean/controller/checkbox.js';
import {createDefaultPluginPool} from '../plugin/plugins.js';
import {VERSION} from '../version.js';
import {BladeApi} from './common/api/blade.js';
import {BladeController} from './common/controller/blade.js';
import {
	BladeState,
	exportBladeState,
	importBladeState,
} from './common/controller/blade-state.js';
import {createBlade} from './common/model/blade.js';
import {LabeledValueBladeController} from './label/controller/value.js';
import {BladePlugin} from './plugin.js';

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

export class TestValueBladeApi extends BladeApi<
	LabeledValueBladeController<boolean, CheckboxController>
> {
	get value(): boolean {
		return this.controller.value.rawValue;
	}

	set value(value: boolean) {
		this.controller.value.rawValue = value;
	}
}

interface TestBladeParams extends BaseBladeParams {
	view: 'test';
}

export const TestValueBladePlugin: BladePlugin<TestBladeParams> = {
	id: 'test',
	type: 'blade',
	core: VERSION,
	accept(params) {
		const r = parseRecord(params, (p) => ({
			view: p.required.constant('test'),
		}));
		return r ? {params: r} : null;
	},
	controller(args) {
		const v = createValue<boolean>(false);
		return new LabeledValueBladeController<boolean, CheckboxController>(
			args.document,
			{
				blade: createBlade(),
				props: ValueMap.fromObject<LabelPropsObject>({
					label: '',
				}),
				value: v,
				valueController: new CheckboxController(args.document, {
					value: v,
					viewProps: args.viewProps,
				}),
			},
		);
	},
	api(args) {
		if (!(args.controller instanceof LabeledValueBladeController)) {
			return null;
		}
		const vc = args.controller.valueController;
		if (!(vc instanceof CheckboxController)) {
			return null;
		}
		return new TestValueBladeApi(args.controller);
	},
};

export function createAppropriateBladeController(
	doc: Document,
): BladeController {
	return TestValueBladePlugin.controller({
		blade: createBlade(),
		document: doc,
		params: {
			view: 'test',
			disabled: false,
			hidden: false,
		},
		viewProps: ViewProps.create(),
	});
}

export function createAppropriateBladeApi(doc: Document): BladeApi {
	const api = TestValueBladePlugin.api({
		controller: createAppropriateBladeController(doc),
		pool: createDefaultPluginPool(),
	});
	if (!api) {
		throw TpError.shouldNeverHappen();
	}
	return api;
}

export class TestKeyBladeController extends BladeController {
	public key: string;

	constructor(doc: Document, key: string) {
		const viewProps = ViewProps.create();
		const view = new PlainView(doc, {
			viewName: '',
			viewProps: viewProps,
		});
		super({
			blade: createBlade(),
			view: view,
			viewProps: viewProps,
		});

		this.key = key;
	}

	override importState(state: BladeState): boolean {
		return importBladeState(
			state,
			(s) => super.importState(s),
			(p) => ({
				key: p.required.string,
			}),
			(result) => {
				this.key = String(result.key);
				return true;
			},
		);
	}

	override exportState(): BladeState {
		return exportBladeState(() => super.exportState(), {
			key: this.key,
		});
	}
}
