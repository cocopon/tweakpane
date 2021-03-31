import {getAllPlugins} from './blade/common/api/plugins';
import {registerPlugin} from './blade/common/api/util';
import {Blade} from './blade/common/model/blade';
import {RootController} from './blade/folder/root';
import {BladePlugin} from './blade/plugin';
import {RootApi} from './blade/root/api/root';
import {TextBladePlugin} from './blade/text/plugin';
import {getWindowDocument} from './common/dom-util';
import {createViewProps} from './common/model/view-props';
import {TpError} from './common/tp-error';
import {ClassName} from './common/view/class-name';
import {BooleanInputPlugin} from './input-bindings/boolean/plugin';
import {NumberColorInputPlugin} from './input-bindings/color/plugin-number';
import {ObjectColorInputPlugin} from './input-bindings/color/plugin-object';
import {StringColorInputPlugin} from './input-bindings/color/plugin-string';
import {NumberInputPlugin} from './input-bindings/number/plugin';
import {InputBindingPlugin} from './input-bindings/plugin';
import {Point2dInputPlugin} from './input-bindings/point-2d/plugin';
import {Point3dInputPlugin} from './input-bindings/point-3d/plugin';
import {Point4dInputPlugin} from './input-bindings/point-4d/plugin';
import {StringInputPlugin} from './input-bindings/string/plugin';
import {Semver} from './misc/semver';
import {BooleanMonitorPlugin} from './monitor-bindings/boolean/plugin';
import {NumberMonitorPlugin} from './monitor-bindings/number/plugin';
import {MonitorBindingPlugin} from './monitor-bindings/plugin';
import {StringMonitorPlugin} from './monitor-bindings/string/plugin';
import {TweakpaneConfig} from './pane/tweakpane-config';

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
	public static readonly version = new Semver('3.14.16');
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
			viewProps: createViewProps(),
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
}

function registerDefaultPlugins() {
	[
		Point2dInputPlugin,
		Point3dInputPlugin,
		Point4dInputPlugin,
		StringInputPlugin,
		NumberInputPlugin,
		StringColorInputPlugin,
		ObjectColorInputPlugin,
		NumberColorInputPlugin,
		BooleanInputPlugin,
	].forEach((p: InputBindingPlugin<any, any>) => {
		registerPlugin({
			type: 'input',
			plugin: p,
		});
	});

	[BooleanMonitorPlugin, StringMonitorPlugin, NumberMonitorPlugin].forEach(
		(p: MonitorBindingPlugin<any>) => {
			registerPlugin({
				type: 'monitor',
				plugin: p,
			});
		},
	);

	[TextBladePlugin].forEach((p: BladePlugin<any>) => {
		registerPlugin({
			type: 'blade',
			plugin: p,
		});
	});
}
registerDefaultPlugins();
