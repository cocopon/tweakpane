import {getAllPlugins} from './api/plugins';
import {RootApi} from './api/root';
import {TweakpaneConfig} from './pane/tweakpane-config';
import {getWindowDocument} from './plugin/common/dom-util';
import {Blade} from './plugin/common/model/blade';
import {PaneError} from './plugin/common/pane-error';
import {ClassName} from './plugin/common/view/class-name';
import {RootController} from './plugin/general/root/controller';
import {InputBindingPlugin} from './plugin/input-binding';
import {BooleanInputPlugin} from './plugin/input-bindings/boolean/plugin';
import {NumberColorInputPlugin} from './plugin/input-bindings/color/plugin-number';
import {ObjectColorInputPlugin} from './plugin/input-bindings/color/plugin-object';
import {StringColorInputPlugin} from './plugin/input-bindings/color/plugin-string';
import {NumberInputPlugin} from './plugin/input-bindings/number/plugin';
import {Point2dInputPlugin} from './plugin/input-bindings/point-2d/plugin';
import {StringInputPlugin} from './plugin/input-bindings/string/plugin';
import {MonitorBindingPlugin} from './plugin/monitor-binding';
import {BooleanMonitorPlugin} from './plugin/monitor-bindings/boolean/plugin';
import {NumberMonitorPlugin} from './plugin/monitor-bindings/number/plugin';
import {StringMonitorPlugin} from './plugin/monitor-bindings/string/plugin';

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

function embedDefaultStyleIfNeeded(doc: Document) {
	embedStyle(doc, 'default', '__css__');

	getAllPlugins().forEach((plugin) => {
		if (plugin.css) {
			embedStyle(doc, `plugin-${plugin.id}`, plugin.css);
		}
	});
}

export default class Tweakpane extends RootApi {
	private doc_: Document | null;
	private containerElem_: HTMLElement | null;
	private usesDefaultWrapper_: boolean;

	constructor(opt_config?: TweakpaneConfig) {
		const config = opt_config || {};
		const doc = config.document ?? getWindowDocument();

		const rootController = new RootController(doc, {
			expanded: config.expanded,
			blade: new Blade(),
			title: config.title,
		});
		super(rootController);

		this.containerElem_ = config.container || createDefaultWrapperElement(doc);
		this.containerElem_.appendChild(this.element);

		this.doc_ = doc;
		this.usesDefaultWrapper_ = !config.container;

		embedDefaultStyleIfNeeded(this.document);
	}

	public get document(): Document {
		if (!this.doc_) {
			throw PaneError.alreadyDisposed();
		}
		return this.doc_;
	}

	public dispose() {
		const containerElem = this.containerElem_;
		if (!containerElem) {
			throw PaneError.alreadyDisposed();
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
}

function registerDefaultPlugins() {
	[
		Point2dInputPlugin,
		StringInputPlugin,
		NumberInputPlugin,
		StringColorInputPlugin,
		ObjectColorInputPlugin,
		NumberColorInputPlugin,
		BooleanInputPlugin,
	].forEach((p: InputBindingPlugin<any, any>) => {
		RootApi.registerPlugin({
			type: 'input',
			plugin: p,
		});
	});

	[BooleanMonitorPlugin, StringMonitorPlugin, NumberMonitorPlugin].forEach(
		(p: MonitorBindingPlugin<any>) => {
			RootApi.registerPlugin({
				type: 'monitor',
				plugin: p,
			});
		},
	);
}
registerDefaultPlugins();
