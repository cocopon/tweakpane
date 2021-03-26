import {ViewProps} from '../../common/model/view-props';
import {ClassName} from '../../common/view/class-name';
import {bindDisabled, bindViewProps} from '../../common/view/reactive';
import {View} from '../../common/view/view';
import {Folder} from './model/folder';

export interface Config {
	folder: Folder;
	viewProps: ViewProps;

	hidesTitle?: boolean;
	viewName?: string;
}

/**
 * @hidden
 */
export class FolderView implements View {
	public readonly containerElement: HTMLDivElement;
	public readonly titleElement: HTMLButtonElement;
	public readonly element: HTMLElement;
	private readonly folder_: Folder;
	private readonly className_: ReturnType<typeof ClassName>;

	constructor(doc: Document, config: Config) {
		this.onFolderChange_ = this.onFolderChange_.bind(this);

		this.folder_ = config.folder;
		this.folder_.emitter.on('change', this.onFolderChange_);

		this.className_ = ClassName(config.viewName || 'fld');
		this.element = doc.createElement('div');
		this.element.classList.add(this.className_());
		bindViewProps(config.viewProps, this.element);

		const titleElem = doc.createElement('button');
		titleElem.classList.add(this.className_('t'));
		titleElem.textContent = this.folder_.title;
		if (config.hidesTitle) {
			titleElem.style.display = 'none';
		}
		bindDisabled(config.viewProps, titleElem);
		this.element.appendChild(titleElem);
		this.titleElement = titleElem;

		const markElem = doc.createElement('div');
		markElem.classList.add(this.className_('m'));
		this.titleElement.appendChild(markElem);

		const containerElem = doc.createElement('div');
		containerElem.classList.add(this.className_('c'));
		this.element.appendChild(containerElem);
		this.containerElement = containerElem;

		this.applyModel_();
	}

	private applyModel_() {
		const expanded = this.folder_.styleExpanded;
		const expandedClass = this.className_(undefined, 'expanded');
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
