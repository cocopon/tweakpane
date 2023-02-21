import {
	BaseBladeParams,
	BladeApi,
	BladePlugin,
	BladeState,
	createBlade,
	createValue,
	exportBladeState,
	importBladeState,
	parseRecord,
	Value,
	ValueBladeController,
	VERSION,
	ViewProps,
} from '@tweakpane/core';

import {TestView} from './test-view';

class TestBladeController extends ValueBladeController<string, TestView> {
	constructor(
		doc: Document,
		config: {
			value: Value<string>;
			viewProps: ViewProps;
		},
	) {
		super({
			blade: createBlade(),
			value: config.value,
			view: new TestView(doc, {
				value: config.value,
			}),
			viewProps: config.viewProps,
		});
	}

	override importState(state: BladeState): boolean {
		return importBladeState(
			state,
			(s) => super.importState(s),
			(p) => ({
				value: p.required.string,
			}),
			(result) => {
				this.value.rawValue = result.value;
				return true;
			},
		);
	}

	override exportState(): BladeState {
		return exportBladeState(() => super.exportState(), {
			value: this.value.rawValue,
		});
	}
}

class TestBladeApi extends BladeApi<TestBladeController> {}

interface TestBladeParams extends BaseBladeParams {
	value: string;
	view: 'test';
}

export const TestBladePlugin: BladePlugin<TestBladeParams> = {
	id: 'blade-test',
	type: 'blade',
	core: VERSION,
	accept(params) {
		const result = parseRecord<TestBladeParams>(params, (p) => ({
			view: p.required.constant('test'),
			value: p.required.string,
		}));
		return result
			? {
					params: result,
			  }
			: null;
	},
	controller(args) {
		return new TestBladeController(args.document, {
			value: createValue(args.params.value),
			viewProps: args.viewProps,
		});
	},
	api(args) {
		if (args.controller instanceof TestBladeController) {
			return new TestBladeApi(args.controller);
		}
		return null;
	},
};
