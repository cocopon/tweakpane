import * as DisposingUtil from '../misc/disposing-util';
import {PaneError} from '../misc/pane-error';
import {Disposable} from '../model/disposable';

/**
 * @hidden
 */
export class View {
	public readonly disposable: Disposable;
	private doc_: Document | null;
	private elem_: HTMLElement | null;

	constructor(document: Document) {
		this.onDispose_ = this.onDispose_.bind(this);

		this.disposable = new Disposable();
		this.disposable.emitter.on('dispose', this.onDispose_);

		this.doc_ = document;
		this.elem_ = this.doc_.createElement('div');
	}

	public get disposed(): boolean {
		return this.disposable.disposed;
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
