import * as DisposingUtil from '../misc/disposing-util';
import {PaneError} from '../misc/pane-error';

/**
 * @hidden
 */
export class View {
	private disposed_: boolean;
	private doc_: Document | null;
	private elem_: HTMLElement | null;

	constructor(document: Document) {
		this.disposed_ = false;
		this.doc_ = document;
		this.elem_ = this.doc_.createElement('div');
	}

	public get disposed(): boolean {
		return this.disposed_;
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
		this.doc_ = null;
		this.elem_ = DisposingUtil.disposeElement(this.elem_);
		this.disposed_ = true;
	}
}
