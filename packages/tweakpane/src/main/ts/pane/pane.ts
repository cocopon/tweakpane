import {
	ClassName,
	createBlade,
	createDefaultPluginPool,
	getWindowDocument,
	PluginPool,
	TabBladePlugin,
	TpError,
	TpPluginBundle,
	ValueMap,
	ViewProps,
} from '@tweakpane/core';

import {ListBladePlugin} from '../blade/list/plugin.js';
import {RootApi} from '../blade/root/api/root.js';
import {RootController} from '../blade/root/controller/root.js';
import {SeparatorBladePlugin} from '../blade/separator/plugin.js';
import {SliderBladePlugin} from '../blade/slider/plugin.js';
import {TextBladePlugin} from '../blade/text/plugin.js';
import {PaneConfig} from './pane-config.js';

function createDefaultWrapperElement(doc: Document): HTMLElement {
	const elem = doc.createElement('div');
	elem.classList.add(ClassName('dfw')());
	if (doc.body) {
		doc.body.appendChild(elem);
	}
	return elem;
}

function embedStyle(doc: Document, id: string, css: string) {
	if (doc.querySelector(`style[data-tp-style=${id}]`)) {
		return;
	}
	const styleElem = doc.createElement('style');
	styleElem.dataset.tpStyle = id;
	styleElem.textContent = css;
	doc.head.appendChild(styleElem);
}

/**
 * The root pane of Tweakpane.
 */
export class Pane extends RootApi {
	private readonly pool_: PluginPool;
	private readonly usesDefaultWrapper_: boolean;
	private doc_: Document | null;
	private containerElem_: HTMLElement | null;

	constructor(opt_config?: PaneConfig) {
		const config = opt_config ?? {};
		const doc = config.document ?? getWindowDocument();

		const pool = createDefaultPluginPool();
		const rootController = new RootController(doc, {
			expanded: config.expanded,
			blade: createBlade(),
			props: ValueMap.fromObject({
				title: config.title,
			}),
			viewProps: ViewProps.create(),
		});
		super(rootController, pool);

		this.pool_ = pool;

		this.containerElem_ = config.container ?? createDefaultWrapperElement(doc);
		this.containerElem_.appendChild(this.element);

		this.doc_ = doc;
		this.usesDefaultWrapper_ = !config.container;

		this.setUpDefaultPlugins_();
	}

	public get document(): Document {
		if (!this.doc_) {
			throw TpError.alreadyDisposed();
		}
		return this.doc_;
	}

	public dispose() {
		const containerElem = this.containerElem_;
		if (!containerElem) {
			throw TpError.alreadyDisposed();
		}

		if (this.usesDefaultWrapper_) {
			const parentElem = containerElem.parentElement;
			if (parentElem) {
				parentElem.removeChild(containerElem);
			}
		}
		this.containerElem_ = null;

		this.doc_ = null;

		super.dispose();
	}

	public registerPlugin(bundle: TpPluginBundle): void {
		if (bundle.css) {
			embedStyle(this.document, `plugin-${bundle.id}`, bundle.css);
		}

		const plugins =
			'plugin' in bundle
				? [bundle.plugin]
				: 'plugins' in bundle
				? bundle.plugins
				: [];
		plugins.forEach((p) => {
			this.pool_.register(bundle.id, p);
		});
	}

	private setUpDefaultPlugins_() {
		this.registerPlugin({
			id: 'default',
			// NOTE: This string literal will be replaced with the default CSS by Rollup at the compilation time
			css: '__css__',
			plugins: [
				ListBladePlugin,
				SeparatorBladePlugin,
				SliderBladePlugin,
				TabBladePlugin,
				TextBladePlugin,
			],
		});
	}
}
