import {
	BaseBladeParams,
	BladeApi,
	BladeController,
	BladePlugin,
	ClassName,
	createBlade,
	ParamsParsers,
	parseParams,
	View,
	ViewProps,
} from '@tweakpane/core';

const className = ClassName('ph');

class PlaceholderView implements View {
	public readonly element: HTMLElement;

	constructor(
		doc: Document,
		config: {
			lineCount: number;
			title: string;
			viewProps: ViewProps;
		},
	) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		this.element.style.height = `calc(${config.lineCount} * var(--bld-us))`;
		config.viewProps.bindClassModifiers(this.element);

		const titleElem = doc.createElement('div');
		titleElem.classList.add(className('t'));
		titleElem.textContent = config.title;
		this.element.appendChild(titleElem);
	}
}

class PlaceholderController extends BladeController<PlaceholderView> {
	constructor(
		doc: Document,
		config: {
			lineCount: number;
			title: string;
			viewProps: ViewProps;
		},
	) {
		super({
			blade: createBlade(),
			view: new PlaceholderView(doc, config),
			viewProps: config.viewProps,
		});
	}
}

interface PlaceholderBladeParams extends BaseBladeParams {
	lineCount?: number;
	title: string;
	view: 'placeholder';
}

export const plugin: BladePlugin<PlaceholderBladeParams> = {
	id: 'placeholder',
	type: 'blade',
	css: `.tp-phv {
	align-items: center;
	display: flex;
	height: var(--bld-us);
	position: relative;
}
.tp-phv::before {
	border: var(--mo-fg) dashed 1px;
	border-radius: var(--elm-br);
	bottom: 0;
	content: '';
	left: var(--cnt-v-p);
	opacity: 0.3;
	position: absolute;
	right: var(--cnt-v-p);
	top: 0;
}
.tp-phv_t {
	box-sizing: border-box;
	color: var(--mo-fg);
	flex: 1;
	padding: 4px;
	text-align: center;
}
`,
	accept(params) {
		const p = ParamsParsers;
		const r = parseParams(params, {
			lineCount: p.optional.number,
			title: p.required.string,
			view: p.required.constant('placeholder'),
		});
		return r ? {params: r} : null;
	},
	controller(args) {
		return new PlaceholderController(args.document, {
			lineCount: args.params.lineCount ?? 1,
			title: args.params.title,
			viewProps: args.viewProps,
		});
	},
	api(args) {
		if (!(args.controller instanceof PlaceholderController)) {
			return null;
		}
		return new BladeApi(args.controller);
	},
};
