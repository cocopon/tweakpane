import {
	ClassName,
	createBlade,
	createDefaultPluginPool,
	getWindowDocument,
	PluginPool,
	TabBladePlugin,
	TpError,
	TpPlugin,
	TpPluginBundle,
	ValueMap,
	ViewProps,
} from '@tweakpane/core';

import {ListBladePlugin} from '../blade/list/plugin';
import {RootApi} from '../blade/root/api/root';
import {RootController} from '../blade/root/controller/root';
import {SliderBladePlugin} from '../blade/slider/plugin';
import {TextBladePlugin} from '../blade/text/plugin';
import {PaneConfig} from './pane-config';

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
	private doc_: Document | null;
	private containerElem_: HTMLElement | null;
	private pool_: PluginPool;
	private usesDefaultWrapper_: boolean;

	constructor(opt_config?: PaneConfig) {
		const config = opt_config || {};
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

		this.containerElem_ = config.container || createDefaultWrapperElement(doc);
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
		const plugins =
			'plugin' in bundle
				? [bundle.plugin]
				: 'plugins' in bundle
				? bundle.plugins
				: [];
		plugins.forEach((p) => {
			this.pool_.register(p);
			this.embedPluginStyle_(p);
		});
	}

	private embedPluginStyle_(plugin: TpPlugin): void {
		if (plugin.css) {
			embedStyle(this.document, `plugin-${plugin.id}`, plugin.css);
		}
	}

	private setUpDefaultPlugins_() {
		// NOTE: This string literal will be replaced with the default CSS by Rollup at the compilation time
		embedStyle(this.document, 'default', '__css__');

		this.pool_.getAll().forEach((plugin) => {
			this.embedPluginStyle_(plugin);
		});

		this.registerPlugin({
			plugins: [
				SliderBladePlugin,
				ListBladePlugin,
				TabBladePlugin,
				TextBladePlugin,
			],
		});
	}
}
