import {Controller} from '../common/controller/controller';
import {parseRecord} from '../common/micro-parsers';
import {ValueMap} from '../common/model/value-map';
import {createValue} from '../common/model/values';
import {ViewProps} from '../common/model/view-props';
import {BaseBladeParams} from '../common/params';
import {PlainView} from '../common/view/plain';
import {CheckboxController} from '../input-binding/boolean/controller/checkbox';
import {VERSION} from '../version';
import {BladeApi} from './common/api/blade';
import {BladeController, BladeControllerState} from './common/controller/blade';
import {createBlade} from './common/model/blade';
import {LabelBladeController} from './label/controller/label';
import {LabeledValueController} from './label/controller/value-label';
import {LabelPropsObject} from './label/view/label';
import {BladePlugin} from './plugin';

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

export function createLabelController(doc: Document, vc: LabelableController) {
	return new LabelBladeController(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({label: ''}),
		valueController: vc,
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

export class TestValueBladeApi extends BladeApi<
	LabeledValueController<boolean, CheckboxController>
> {
	get value(): boolean {
		return this.controller_.value.rawValue;
	}

	set value(value: boolean) {
		this.controller_.value.rawValue = value;
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
		return new LabeledValueController<boolean, CheckboxController>(
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
		if (!(args.controller instanceof LabeledValueController)) {
			return null;
		}
		const vc = args.controller.valueController;
		if (!(vc instanceof CheckboxController)) {
			return null;
		}
		return new TestValueBladeApi(args.controller);
	},
};

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

	public import(state: BladeControllerState): boolean {
		if (!super.import(state)) {
			return false;
		}

		const result = parseRecord(state, (p) => ({
			key: p.required.string,
		}));
		if (!result) {
			return false;
		}

		this.key = String(result.key);
		return true;
	}

	public export(): BladeControllerState {
		return {
			key: this.key,
		};
	}
}
