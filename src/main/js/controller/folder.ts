import * as DomUtil from '../misc/dom-util';
import {TypeUtil} from '../misc/type-util';
import {Folder, FolderEvents} from '../model/folder';
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
		this.onContainerTransitionEnd_ = this.onContainerTransitionEnd_.bind(this);
		this.onFolderBeforeChange_ = this.onFolderBeforeChange_.bind(this);
		this.onTitleClick_ = this.onTitleClick_.bind(this);
		this.onUiContainerAdd_ = this.onUiContainerAdd_.bind(this);
		this.onUiContainerItemLayout_ = this.onUiContainerItemLayout_.bind(this);
		this.onUiContainerRemove_ = this.onUiContainerRemove_.bind(this);

		this.viewModel = config.viewModel;
		this.folder = new Folder(
			config.title,
			TypeUtil.getOrDefault<boolean>(config.expanded, true),
		);
		this.folder.emitter.on('beforechange', this.onFolderBeforeChange_);

		this.ucList_ = new UiContainer();
		this.ucList_.emitter.on('add', this.onUiContainerAdd_);
		this.ucList_.emitter.on('itemlayout', this.onUiContainerItemLayout_);
		this.ucList_.emitter.on('remove', this.onUiContainerRemove_);

		this.doc_ = document;
		this.view = new FolderView(this.doc_, {
			folder: this.folder,
			model: this.viewModel,
		});
		this.view.titleElement.addEventListener('click', this.onTitleClick_);
		this.view.containerElement.addEventListener(
			'transitionend',
			this.onContainerTransitionEnd_,
		);
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
			// Expand folder temporarily
			this.folder.expandedHeight = null;
			this.folder.temporaryExpanded = true;

			DomUtil.forceReflow(elem);

			// Compute height
			height = elem.clientHeight;

			// Restore expanded
			this.folder.temporaryExpanded = null;

			DomUtil.forceReflow(elem);
		});

		return height;
	}

	private onFolderBeforeChange_(ev: FolderEvents['beforechange']): void {
		if (ev.propertyName !== 'expanded') {
			return;
		}

		if (TypeUtil.isEmpty(this.folder.expandedHeight)) {
			this.folder.expandedHeight = this.computeExpandedHeight_();
		}

		this.folder.shouldFixHeight = true;
		DomUtil.forceReflow(this.view.containerElement);
	}

	private onTitleClick_() {
		this.folder.expanded = !this.folder.expanded;
	}

	private applyUiContainerChange_(): void {
		ContainerUtil.updateAllItemsPositions(this.uiContainer);
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

	private onUiContainerItemLayout_(_: UiContainerEvents['itemlayout']) {
		this.applyUiContainerChange_();
	}

	private onContainerTransitionEnd_(ev: TransitionEvent): void {
		if (ev.propertyName !== 'height') {
			return;
		}

		this.folder.shouldFixHeight = false;
		this.folder.expandedHeight = null;
	}
}
