import * as DisposingUtil from '../misc/disposing-util';
import {PaneError} from '../misc/pane-error';
import {Disposable} from '../model/disposable';

/**
 * @hidden
 */
export interface ViewConfig {
	disposable: Disposable;
}

/**
 * @hidden
 */
export class View {
	private readonly disposable_: Disposable;
	private doc_: Document | null;
	private elem_: HTMLElement | null;

	constructor(document: Document, config: ViewConfig) {
		this.onDispose_ = this.onDispose_.bind(this);

		this.disposable_ = config.disposable;
		this.disposable_.emitter.on('dispose', this.onDispose_);

		this.doc_ = document;
		this.elem_ = this.doc_.createElement('div');
	}

	public get document(): Document {
		if (!this.doc_) {
			throw PaneError.alreadyDisposed();
		}
		return this.doc_;
	}

	public get element(): HTMLElement {
		if (!this.elem_) {
			throw PaneError.alreadyDisposed();
		}
		return this.elem_;
	}

	private onDispose_(): void {
		this.doc_ = null;
		this.elem_ = DisposingUtil.disposeElement(this.elem_);
	}
}
