import {TypeUtil} from '../misc/type-util';
import {Folder} from '../model/folder';
import {
	UiControllerList,
	UiControllerListEvents,
} from '../model/ui-controller-list';
import {ViewModel} from '../model/view-model';
import {RootView} from '../view/root';

interface Config {
	expanded?: boolean;
	title?: string;
	viewModel: ViewModel;
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
	public readonly viewModel: ViewModel;
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
		this.viewModel = config.viewModel;
		this.view = new RootView(this.doc_, {
			folder: this.folder,
			model: this.viewModel,
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
