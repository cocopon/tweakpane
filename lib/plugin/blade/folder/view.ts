import {ClassName} from '../../common/view/class-name';
import {View} from '../../common/view/view';
import {Folder} from './model/folder';

interface Config {
	folder: Folder;
}

const className = ClassName('fld');

/**
 * @hidden
 */
export class FolderView implements View {
	public readonly containerElement: HTMLDivElement;
	public readonly titleElement: HTMLButtonElement;
	public readonly element: HTMLElement;
	private folder_: Folder;

	constructor(doc: Document, config: Config) {
		this.onFolderChange_ = this.onFolderChange_.bind(this);

		this.folder_ = config.folder;
		this.folder_.emitter.on('change', this.onFolderChange_);

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const titleElem = doc.createElement('button');
		titleElem.classList.add(className('t'));
		titleElem.textContent = this.folder_.title;
		this.element.appendChild(titleElem);
		this.titleElement = titleElem;

		const markElem = doc.createElement('div');
		markElem.classList.add(className('m'));
		this.titleElement.appendChild(markElem);

		const containerElem = doc.createElement('div');
		containerElem.classList.add(className('c'));
		this.element.appendChild(containerElem);
		this.containerElement = containerElem;

		this.applyModel_();
	}

	private applyModel_() {
		const expanded = this.folder_.styleExpanded;
		const expandedClass = className(undefined, 'expanded');
		if (expanded) {
			this.element.classList.add(expandedClass);
		} else {
			this.element.classList.remove(expandedClass);
		}
		this.containerElement.style.height = this.folder_.styleHeight;
	}

	private onFolderChange_() {
		this.applyModel_();
	}
}
