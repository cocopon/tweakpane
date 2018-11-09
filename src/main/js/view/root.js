// @flow

import ClassName from '../misc/class-name';
import Folder from '../model/folder';
import View from './view';

type Config = {
	folder: ?Folder,
};

const className = ClassName('rot');

export default class RootView extends View {
	containerElem_: HTMLDivElement;
	folder_: ?Folder;
	titleElem_: ?HTMLButtonElement;

	constructor(document: Document, config: Config) {
		super(document);

		(this: any).onFolderChange_ = this.onFolderChange_.bind(this);

		this.folder_ = config.folder;
		if (this.folder_) {
			this.folder_.emitter.on(
				'change',
				this.onFolderChange_,
			);
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
	}

	get titleElement(): ?HTMLElement {
		return this.titleElem_;
	}

	get containerElement(): HTMLDivElement {
		return this.containerElem_;
	}

	applyModel_() {
		const expanded = this.folder_ ?
			this.folder_.expanded :
			true;
		const expandedClass = className(null, 'expanded');
		if (expanded) {
			this.element.classList.add(expandedClass);
		} else {
			this.element.classList.remove(expandedClass);
		}

		// TODO: Animate
	}

	onFolderChange_() {
		this.applyModel_();
	}
}
