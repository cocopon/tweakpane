import * as DomUtil from '../misc/dom-util';
import {TypeUtil} from '../misc/type-util';
import {Folder} from '../model/folder';
import {
	UiControllerList,
	UiControllerListEvents,
} from '../model/ui-controller-list';
import {ViewModel} from '../model/view-model';
import {RootView} from '../view/root';
import * as ContainerUtil from './container-util';

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
		this.onUiControllerListLayout_ = this.onUiControllerListLayout_.bind(this);
		this.onUiControllerListRemove_ = this.onUiControllerListRemove_.bind(this);

		this.folder = createFolder(config);

		this.ucList_ = new UiControllerList();
		this.ucList_.emitter.on('add', this.onUiControllerListAdd_);
		this.ucList_.emitter.on('layout', this.onUiControllerListLayout_);
		this.ucList_.emitter.on('remove', this.onUiControllerListRemove_);

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

	private applyUiControllerListChange_(): void {
		ContainerUtil.updateAllItemsPositions(this.uiControllerList);
	}

	private onUiControllerListAdd_(ev: UiControllerListEvents['add']) {
		DomUtil.insertElementAt(
			this.view.containerElement,
			ev.uiController.view.element,
			ev.index,
		);
		this.applyUiControllerListChange_();
	}

	private onUiControllerListRemove_(_: UiControllerListEvents['remove']) {
		this.applyUiControllerListChange_();
	}

	private onUiControllerListLayout_(_: UiControllerListEvents['layout']) {
		this.applyUiControllerListChange_();
	}

	private onTitleClick_() {
		if (this.folder) {
			this.folder.expanded = !this.folder.expanded;
		}
	}
}
