import * as DisposingUtil from '../misc/disposing-util';
import {PaneError} from '../misc/pane-error';
import {Disposable} from '../model/disposable';

/**
 * @hidden
 */
export class View {
	private disposable_: Disposable;
	private doc_: Document | null;
	private elem_: HTMLElement | null;

	constructor(document: Document) {
		this.disposable_ = new Disposable();
		this.doc_ = document;
		this.elem_ = this.doc_.createElement('div');
	}

	public get disposed(): boolean {
		return this.disposable_.disposed;
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

	public dispose(): void {
		if (!this.disposable_.dispose()) {
			return;
		}

		this.doc_ = null;
		this.elem_ = DisposingUtil.disposeElement(this.elem_);
	}
}
