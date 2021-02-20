import {disposeElement} from '../disposing-util';
import {ViewModel, ViewModelEvents} from '../model/view-model';
import {getAllViewPositions} from '../model/view-positions';
import {PaneError} from '../pane-error';
import {ClassName} from './class-name';

/**
 * @hidden
 */
export interface ViewConfig {
	model: ViewModel;
}

const className = ClassName('');

/**
 * @hidden
 */
export class View {
	protected elem_: HTMLElement | null;
	protected readonly model_: ViewModel;
	private doc_: Document | null;

	constructor(document: Document, config: ViewConfig) {
		this.onChange_ = this.onChange_.bind(this);
		this.onDispose_ = this.onDispose_.bind(this);

		this.model_ = config.model;
		this.model_.emitter.on('change', this.onChange_);
		this.model_.emitter.on('dispose', this.onDispose_);

		this.doc_ = document;
		this.elem_ = this.doc_.createElement('div');
		this.elem_.classList.add(className());
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
		this.elem_ = disposeElement(this.elem_);
	}

	private onChange_(ev: ViewModelEvents['change']): void {
		const elem = this.elem_;
		if (!elem) {
			throw PaneError.alreadyDisposed();
		}

		if (ev.propertyName === 'hidden') {
			const hiddenClass = className(undefined, 'hidden');
			if (this.model_.hidden) {
				elem.classList.add(hiddenClass);
			} else {
				elem.classList.remove(hiddenClass);
			}
		} else if (ev.propertyName === 'positions') {
			getAllViewPositions().forEach((pos) => {
				elem.classList.remove(className(undefined, pos));
			});
			this.model_.positions.forEach((pos) => {
				elem.classList.add(className(undefined, pos));
			});
		}
	}
}
