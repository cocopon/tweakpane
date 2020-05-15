import {RootApi} from './api/root';
import {RootController} from './controller/root';
import {ClassName} from './misc/class-name';
import * as DomUtil from './misc/dom-util';
import {PaneError} from './misc/pane-error';
import {TypeUtil} from './misc/type-util';
import {Disposable} from './model/disposable';
import {TweakpaneConfig} from './tweakpane-config';

function createDefaultWrapperElement(document: Document): HTMLElement {
	const elem = document.createElement('div');
	elem.classList.add(ClassName('dfw')());
	if (document.body) {
		document.body.appendChild(elem);
	}
	return elem;
}

export class TweakpaneWithoutStyle extends RootApi {
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
			disposable: new Disposable(),
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
