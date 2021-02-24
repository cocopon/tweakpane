import {ClassName} from '../../common/view/class-name';
import {View} from '../../common/view/view';
import {Folder} from '../folder/model/folder';

interface Config {
	folder: Folder | null;
}

const className = ClassName('rot');

/**
 * @hidden
 */
export class RootView implements View {
	public readonly element: HTMLElement;
	public readonly containerElement: HTMLDivElement;
	private folder_: Folder | null;
	private titleElem_: HTMLButtonElement | null = null;

	constructor(doc: Document, config: Config) {
		this.onFolderChange_ = this.onFolderChange_.bind(this);

		this.folder_ = config.folder;
		if (this.folder_) {
			this.folder_.emitter.on('change', this.onFolderChange_);
		}

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const folder = this.folder_;
		if (folder) {
			const titleElem = doc.createElement('button');
			titleElem.classList.add(className('t'));
			titleElem.textContent = folder.title;
			this.element.appendChild(titleElem);

			const markElem = doc.createElement('div');
			markElem.classList.add(className('m'));
			titleElem.appendChild(markElem);

			this.titleElem_ = titleElem;
		}

		const containerElem = doc.createElement('div');
		containerElem.classList.add(className('c'));
		this.element.appendChild(containerElem);
		this.containerElement = containerElem;

		this.applyModel_();
	}

	get titleElement(): HTMLElement | null {
		return this.titleElem_;
	}

	private applyModel_() {
		const expanded = this.folder_ ? this.folder_.styleExpanded : true;
		const expandedClass = className(undefined, 'expanded');
		if (expanded) {
			this.element.classList.add(expandedClass);
		} else {
			this.element.classList.remove(expandedClass);
		}
		this.containerElement.style.height = this.folder_
			? this.folder_.styleHeight
			: 'auto';
	}

	private onFolderChange_() {
		this.applyModel_();
	}
}
