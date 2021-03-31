import {Semver} from './misc/semver';
import {TweakpaneConfig} from './pane/tweakpane-config';
import {BladePlugin} from './plugin/blade';
import {getAllPlugins} from './plugin/blade/common/api/plugins';
import {registerPlugin} from './plugin/blade/common/api/util';
import {Blade} from './plugin/blade/common/model/blade';
import {RootController} from './plugin/blade/folder/root';
import {RootApi} from './plugin/blade/root/api/root';
import {TextBladePlugin} from './plugin/blade/text/plugin';
import {getWindowDocument} from './plugin/common/dom-util';
import {createViewProps} from './plugin/common/model/view-props';
import {TpError} from './plugin/common/tp-error';
import {ClassName} from './plugin/common/view/class-name';
import {InputBindingPlugin} from './plugin/input-binding';
import {BooleanInputPlugin} from './plugin/input-bindings/boolean/plugin';
import {NumberColorInputPlugin} from './plugin/input-bindings/color/plugin-number';
import {ObjectColorInputPlugin} from './plugin/input-bindings/color/plugin-object';
import {StringColorInputPlugin} from './plugin/input-bindings/color/plugin-string';
import {NumberInputPlugin} from './plugin/input-bindings/number/plugin';
import {Point2dInputPlugin} from './plugin/input-bindings/point-2d/plugin';
import {Point3dInputPlugin} from './plugin/input-bindings/point-3d/plugin';
import {Point4dInputPlugin} from './plugin/input-bindings/point-4d/plugin';
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
