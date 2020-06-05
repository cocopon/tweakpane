import * as DomUtil from '../misc/dom-util';
import {TypeUtil} from '../misc/type-util';
import {Folder} from '../model/folder';
import {
	UiControllerList,
	UiControllerListEvents,
} from '../model/ui-controller-list';
import {ViewModel} from '../model/view-model';
import {FolderView} from '../view/folder';
import * as ContainerUtil from './container-util';

interface Config {
	expanded?: boolean;
	title: string;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class FolderController {
	public readonly viewModel: ViewModel;
	public readonly folder: Folder;
	public readonly view: FolderView;
	private doc_: Document;
	private ucList_: UiControllerList;

	constructor(document: Document, config: Config) {
		this.onTitleClick_ = this.onTitleClick_.bind(this);
		this.onUiControllerListAdd_ = this.onUiControllerListAdd_.bind(this);
		this.onUiControllerListLayout_ = this.onUiControllerListLayout_.bind(this);
		this.onUiControllerListRemove_ = this.onUiControllerListRemove_.bind(this);

		this.viewModel = config.viewModel;
		this.folder = new Folder(
			config.title,
			TypeUtil.getOrDefault<boolean>(config.expanded, true),
		);

		this.ucList_ = new UiControllerList();
		this.ucList_.emitter.on('add', this.onUiControllerListAdd_);
		this.ucList_.emitter.on('layout', this.onUiControllerListLayout_);
		this.ucList_.emitter.on('remove', this.onUiControllerListRemove_);

		this.doc_ = document;
		this.view = new FolderView(this.doc_, {
			folder: this.folder,
			model: this.viewModel,
		});
		this.view.titleElement.addEventListener('click', this.onTitleClick_);
	}

	get document(): Document {
		return this.doc_;
	}

	get uiControllerList(): UiControllerList {
		return this.ucList_;
	}

	private computeExpandedHeight_(): number {
		const elem = this.view.containerElement;

		let height = 0;
		DomUtil.disableTransitionTemporarily(elem, () => {
			// Expand folder
			const expanded = this.folder.expanded;
			this.folder.expandedHeight = null;
			this.folder.expanded = true;

			DomUtil.forceReflow(elem);

			// Compute height
			height = elem.clientHeight;

			// Restore expanded
			this.folder.expanded = expanded;

			DomUtil.forceReflow(elem);
		});

		return height;
	}

	private onTitleClick_() {
		this.folder.expanded = !this.folder.expanded;
	}

	private applyUiControllerListChange_(): void {
		ContainerUtil.updateAllItemsPositions(this.uiControllerList);

		this.folder.expandedHeight = this.computeExpandedHeight_();
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
}
