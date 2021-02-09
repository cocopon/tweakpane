import {RootApi} from '../api/root';
import {RootController} from '../controller/root';
import {ClassName} from '../misc/class-name';
import * as DomUtil from '../misc/dom-util';
import {PaneError} from '../misc/pane-error';
import {TypeUtil} from '../misc/type-util';
import {ViewModel} from '../model/view-model';
import {InputBindingPlugin} from '../plugin/input-binding';
import {BooleanInputPlugin} from '../plugin/input-bindings/boolean';
import {NumberColorInputPlugin} from '../plugin/input-bindings/color-number';
import {ObjectColorInputPlugin} from '../plugin/input-bindings/color-object';
import {StringColorInputPlugin} from '../plugin/input-bindings/color-string';
import {NumberInputPlugin} from '../plugin/input-bindings/number';
import {Point2dInputPlugin} from '../plugin/input-bindings/point-2d';
import {StringInputPlugin} from '../plugin/input-bindings/string';
import {MonitorBindingPlugin} from '../plugin/monitor-binding';
import {BooleanMonitorPlugin} from '../plugin/monitor-bindings/boolean';
import {NumberMonitorPlugin} from '../plugin/monitor-bindings/number';
import {StringMonitorPlugin} from '../plugin/monitor-bindings/string';
import {TweakpaneConfig} from './tweakpane-config';

function createDefaultWrapperElement(document: Document): HTMLElement {
	const elem = document.createElement('div');
	elem.classList.add(ClassName('dfw')());
	if (document.body) {
		document.body.appendChild(elem);
	}
	return elem;
}

export class PlainTweakpane extends RootApi {
	private doc_: Document | null;
	private containerElem_: HTMLElement | null;
	private usesDefaultWrapper_: boolean;

	constructor(opt_config?: TweakpaneConfig) {
		const config = opt_config || {};
		const document = TypeUtil.getOrDefault(
			config.document,
			DomUtil.getWindowDocument(),
		);

		const rootController = new RootController(document, {
			expanded: config.expanded,
			viewModel: new ViewModel(),
			title: config.title,
		});
		super(rootController);

		this.containerElem_ =
			config.container || createDefaultWrapperElement(document);
		this.containerElem_.appendChild(this.element);

		this.doc_ = document;
		this.usesDefaultWrapper_ = !config.container;
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

	protected get document(): Document {
		if (!this.doc_) {
			throw PaneError.alreadyDisposed();
		}
		return this.doc_;
	}
}

function registerDefaultPlugins() {
	[
		BooleanInputPlugin,
		NumberColorInputPlugin,
		ObjectColorInputPlugin,
		StringColorInputPlugin,
		NumberInputPlugin,
		StringInputPlugin,
		Point2dInputPlugin,
	].forEach((p: InputBindingPlugin<any, any>) => {
		RootApi.registerPlugin({
			type: 'input',
			plugin: p,
		});
	});

	[NumberMonitorPlugin, StringMonitorPlugin, BooleanMonitorPlugin].forEach(
		(p: MonitorBindingPlugin<any, any>) => {
			RootApi.registerPlugin({
				type: 'monitor',
				plugin: p,
			});
		},
	);
}
registerDefaultPlugins();
