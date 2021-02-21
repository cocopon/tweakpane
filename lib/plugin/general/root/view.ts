import {disposeElement} from '../../common/disposing-util';
import {Folder} from '../../common/model/folder';
import {PaneError} from '../../common/pane-error';
import {ClassName} from '../../common/view/class-name';
import {View, ViewConfig} from '../../common/view/view';

interface Config extends ViewConfig {
	folder: Folder | null;
}

const className = ClassName('rot');

/**
 * @hidden
 */
export class RootView extends View {
	private containerElem_: HTMLDivElement | null;
	private folder_: Folder | null;
	private titleElem_: HTMLButtonElement | null = null;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.onFolderChange_ = this.onFolderChange_.bind(this);

		this.folder_ = config.folder;
		if (this.folder_) {
			this.folder_.emitter.on('change', this.onFolderChange_);
		}

		this.element.classList.add(className());

		const folder = this.folder_;
		if (folder) {
			const titleElem = document.createElement('button');
			titleElem.classList.add(className('t'));
			titleElem.textContent = folder.title;
			this.element.appendChild(titleElem);

			const markElem = document.createElement('div');
			markElem.classList.add(className('m'));
			titleElem.appendChild(markElem);

			this.titleElem_ = titleElem;
		}

		const containerElem = document.createElement('div');
		containerElem.classList.add(className('c'));
		this.element.appendChild(containerElem);
		this.containerElem_ = containerElem;

		this.applyModel_();

		config.model.emitter.on('dispose', () => {
			this.containerElem_ = disposeElement(this.containerElem_);
			this.folder_ = null;
			this.titleElem_ = disposeElement(this.titleElem_);
		});
	}

	get titleElement(): HTMLElement | null {
		return this.titleElem_;
	}

	get containerElement(): HTMLDivElement {
		if (!this.containerElem_) {
			throw PaneError.alreadyDisposed();
		}
		return this.containerElem_;
	}

	private applyModel_() {
		const containerElem = this.containerElem_;
		if (!containerElem) {
			throw PaneError.alreadyDisposed();
		}

		const expanded = this.folder_ ? this.folder_.styleExpanded : true;
		const expandedClass = className(undefined, 'expanded');
		if (expanded) {
			this.element.classList.add(expandedClass);
		} else {
			this.element.classList.remove(expandedClass);
		}
		containerElem.style.height = this.folder_
			? this.folder_.styleHeight
			: 'auto';
	}

	private onFolderChange_() {
		this.applyModel_();
	}
}
