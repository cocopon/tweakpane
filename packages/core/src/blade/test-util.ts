import {Controller} from '../common/controller/controller';
import {ValueMap} from '../common/model/value-map';
import {createValue} from '../common/model/values';
import {ViewProps} from '../common/model/view-props';
import {BaseBladeParams} from '../common/params';
import {ParamsParsers, parseParams} from '../common/params-parsers';
import {PlainView} from '../common/view/plain';
import {View} from '../common/view/view';
import {CheckboxController} from '../input-binding/boolean/controller/checkbox';
import {BladeApi} from './common/api/blade';
import {BladeController} from './common/controller/blade';
import {createBlade} from './common/model/blade';
import {LabelController} from './label/controller/label';
import {LabeledValueController} from './label/controller/value-label';
import {LabelPropsObject} from './label/view/label';
import {BladePlugin} from './plugin';

class LabelableController implements Controller<View> {
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
	return new LabelController(doc, {
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
	LabelController<CheckboxController>
> {
	get value(): boolean {
		return this.controller_.valueController.value.rawValue;
	}

	set value(value: boolean) {
		this.controller_.valueController.value.rawValue = value;
	}
}

interface TestBladeParams extends BaseBladeParams {
	view: 'test';
}

export const TestValueBladePlugin: BladePlugin<TestBladeParams> = {
	id: 'test',
	type: 'blade',
	accept(params) {
		const p = ParamsParsers;
		const r = parseParams(params, {
			view: p.required.constant('test'),
		});
		return r ? {params: r} : null;
	},
	controller(args) {
		return new LabeledValueController<boolean, CheckboxController>(
			args.document,
			{
				blade: createBlade(),
				props: ValueMap.fromObject<LabelPropsObject>({
					label: '',
				}),
				valueController: new CheckboxController(args.document, {
					value: createValue<boolean>(false),
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
