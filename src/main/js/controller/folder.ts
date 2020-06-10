import * as DomUtil from '../misc/dom-util';
import {TypeUtil} from '../misc/type-util';
import {Folder} from '../model/folder';
import {UiContainer, UiContainerEvents} from '../model/ui-container';
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
	private ucList_: UiContainer;

	constructor(document: Document, config: Config) {
		this.onTitleClick_ = this.onTitleClick_.bind(this);
		this.onUiContainerAdd_ = this.onUiContainerAdd_.bind(this);
		this.onUiContainerLayout_ = this.onUiContainerLayout_.bind(this);
		this.onUiContainerRemove_ = this.onUiContainerRemove_.bind(this);

		this.viewModel = config.viewModel;
		this.folder = new Folder(
			config.title,
			TypeUtil.getOrDefault<boolean>(config.expanded, true),
		);

		this.ucList_ = new UiContainer();
		this.ucList_.emitter.on('add', this.onUiContainerAdd_);
		this.ucList_.emitter.on('layout', this.onUiContainerLayout_);
		this.ucList_.emitter.on('remove', this.onUiContainerRemove_);

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

	get uiContainer(): UiContainer {
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

	private applyUiContainerChange_(): void {
		ContainerUtil.updateAllItemsPositions(this.uiContainer);

		this.folder.expandedHeight = this.computeExpandedHeight_();
	}

	private onUiContainerAdd_(ev: UiContainerEvents['add']) {
		DomUtil.insertElementAt(
			this.view.containerElement,
			ev.uiController.view.element,
			ev.index,
		);
		this.applyUiContainerChange_();
	}

	private onUiContainerRemove_(_: UiContainerEvents['remove']) {
		this.applyUiContainerChange_();
	}

	private onUiContainerLayout_(_: UiContainerEvents['layout']) {
		this.applyUiContainerChange_();
	}
}
