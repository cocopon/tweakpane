import ClassName from '../misc/class-name';
import TypeUtil from '../misc/type-util';
import Folder from '../model/folder';
import View from './view';

interface Config {
	folder: Folder;
}

const className = ClassName('fld');

export default class FolderView extends View {
	private containerElem_: HTMLDivElement;
	private folder_: Folder;
	private titleElem_: HTMLButtonElement;

	constructor(document: Document, config: Config) {
		super(document);

		this.onFolderChange_ = this.onFolderChange_.bind(this);

		this.folder_ = config.folder;
		this.folder_.emitter.on('change', this.onFolderChange_);

		this.element.classList.add(className());

		const titleElem = document.createElement('button');
		titleElem.classList.add(className('t'));
		titleElem.textContent = this.folder_.title;
		this.element.appendChild(titleElem);
		this.titleElem_ = titleElem;

		const markElem = document.createElement('div');
		markElem.classList.add(className('m'));
		this.titleElem_.appendChild(markElem);

		const containerElem = document.createElement('div');
		containerElem.classList.add(className('c'));
		this.element.appendChild(containerElem);
		this.containerElem_ = containerElem;

		this.applyModel_();
	}

	get titleElement(): HTMLElement {
		return this.titleElem_;
	}

	get containerElement(): HTMLElement {
		return this.containerElem_;
	}

	private applyModel_() {
		const expanded = this.folder_.expanded;
		const expandedClass = className(undefined, 'expanded');
		if (expanded) {
			this.element.classList.add(expandedClass);
		} else {
			this.element.classList.remove(expandedClass);
		}

		TypeUtil.ifNotEmpty(
			this.folder_.expandedHeight,
			(expandedHeight) => {
				const containerHeight = expanded ? expandedHeight : 0;
				this.containerElem_.style.height = `${containerHeight}px`;
			},
			() => {
				this.containerElem_.style.height = expanded ? 'auto' : '0px';
			},
		);
	}

	private onFolderChange_() {
		this.applyModel_();
	}
}
