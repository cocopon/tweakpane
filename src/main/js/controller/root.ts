import {TypeUtil} from '../misc/type-util';
import {Disposable} from '../model/disposable';
import {Folder} from '../model/folder';
import {
	UiControllerList,
	UiControllerListEvents,
} from '../model/ui-controller-list';
import {RootView} from '../view/root';

interface Config {
	disposable: Disposable;
	expanded?: boolean;
	title?: string;
}

function createFolder(config: Config): Folder | null {
	if (!config.title) {
		return null;
	}

	return new Folder(
		config.title,
		TypeUtil.getOrDefault<boolean>(config.expanded, true),
	);
}

/**
 * @hidden
 */
export class RootController {
	public readonly disposable: Disposable;
	public readonly folder: Folder | null;
	public readonly view: RootView;
	private doc_: Document;
	private ucList_: UiControllerList;

	constructor(document: Document, config: Config) {
		this.onTitleClick_ = this.onTitleClick_.bind(this);
		this.onUiControllerListAdd_ = this.onUiControllerListAdd_.bind(this);

		this.folder = createFolder(config);

		this.ucList_ = new UiControllerList();
		this.ucList_.emitter.on('add', this.onUiControllerListAdd_);

		this.doc_ = document;
		this.disposable = config.disposable;
		this.view = new RootView(this.doc_, {
			disposable: this.disposable,
			folder: this.folder,
		});
		if (this.view.titleElement) {
			this.view.titleElement.addEventListener('click', this.onTitleClick_);
		}
	}

	get document(): Document {
		return this.doc_;
	}

	get uiControllerList(): UiControllerList {
		return this.ucList_;
	}

	private onUiControllerListAdd_(ev: UiControllerListEvents['add']) {
		this.view.containerElement.insertBefore(
			ev.uiController.view.element,
			this.view.containerElement.children[ev.index],
		);
	}

	private onTitleClick_() {
		if (this.folder) {
			this.folder.expanded = !this.folder.expanded;
		}
	}
}
