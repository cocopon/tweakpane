import {
	BaseBladeParams,
	BladeApi,
	BladeController,
	BladePlugin,
	ClassName,
	createBlade,
	getCssVar,
	ParamsParsers,
	parseParams,
	View,
	ViewProps,
} from '@tweakpane/core';

const cn = ClassName('ph');

class PlaceholderView implements View {
	public readonly element: HTMLElement;

	constructor(
		doc: Document,
		config: {
			rows: number;
			title: string;
			viewProps: ViewProps;
		},
	) {
		this.element = doc.createElement('div');
		this.element.classList.add(cn());
		this.element.style.height = `calc(${config.rows} * var(${getCssVar(
			'containerUnitSize',
		)}))`;
		config.viewProps.bindClassModifiers(this.element);

		const titleElem = doc.createElement('div');
		titleElem.classList.add(cn('t'));
		titleElem.textContent = config.title;
		this.element.appendChild(titleElem);
	}
}

class PlaceholderController extends BladeController<PlaceholderView> {
	constructor(
		doc: Document,
		config: {
			rows: number;
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
	rows?: number;
	title: string;
	view: 'placeholder';
}

export const plugin: BladePlugin<PlaceholderBladeParams> = {
	id: 'placeholder',
	type: 'blade',
	css: `.tp-phv {
	align-items: center;
	display: flex;
	height: var(--cnt-usz);
	margin-left: var(--cnt-vp);
	margin-right: var(--cnt-vp);
	position: relative;
}
.tp-phv::before {
	border: var(--mo-fg) dashed 1px;
	border-radius: var(--bld-br);
	bottom: 0;
	content: '';
	left: 0;
	opacity: 0.3;
	pointer-events: none;
	position: absolute;
	right: 0;
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
			rows: p.optional.number,
			title: p.required.string,
			view: p.required.constant('placeholder'),
		});
		return r ? {params: r} : null;
	},
	controller(args) {
		return new PlaceholderController(args.document, {
			rows: args.params.rows ?? 1,
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
