import * as DomUtil from '../misc/dom-util';
import {TypeUtil} from '../misc/type-util';
import {Folder, FolderEvents} from '../model/folder';
import {UiContainer, UiContainerEvents} from '../model/ui-container';
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
	private ucList_: UiContainer;

	constructor(document: Document, config: Config) {
		this.onContainerTransitionEnd_ = this.onContainerTransitionEnd_.bind(this);
		this.onFolderBeforeChange_ = this.onFolderBeforeChange_.bind(this);
		this.onTitleClick_ = this.onTitleClick_.bind(this);
		this.onUiContainerAdd_ = this.onUiContainerAdd_.bind(this);
		this.onUiContainerItemLayout_ = this.onUiContainerItemLayout_.bind(this);
		this.onUiContainerRemove_ = this.onUiContainerRemove_.bind(this);

		this.folder = createFolder(config);
		if (this.folder) {
			this.folder.emitter.on('beforechange', this.onFolderBeforeChange_);
		}

		this.ucList_ = new UiContainer();
		this.ucList_.emitter.on('add', this.onUiContainerAdd_);
		this.ucList_.emitter.on('itemlayout', this.onUiContainerItemLayout_);
		this.ucList_.emitter.on('remove', this.onUiContainerRemove_);

		this.doc_ = document;
		this.viewModel = config.viewModel;
		this.view = new RootView(this.doc_, {
			folder: this.folder,
			model: this.viewModel,
		});
		if (this.view.titleElement) {
			this.view.titleElement.addEventListener('click', this.onTitleClick_);
		}
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

	private onFolderBeforeChange_(ev: FolderEvents['beforechange']): void {
		if (ev.propertyName !== 'expanded') {
			return;
		}
		const folder = this.folder;
		if (!folder) {
			return;
		}

		if (TypeUtil.isEmpty(folder.expandedHeight)) {
			folder.expandedHeight = ContainerUtil.computeExpandedFolderHeight(
				folder,
				this.view.containerElement,
			);
		}

		folder.shouldFixHeight = true;
		DomUtil.forceReflow(this.view.containerElement);
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

	private onTitleClick_() {
		if (this.folder) {
			this.folder.expanded = !this.folder.expanded;
		}
	}

	private onContainerTransitionEnd_(ev: TransitionEvent): void {
		if (ev.propertyName !== 'height') {
			return;
		}

		if (this.folder) {
			this.folder.shouldFixHeight = false;
			this.folder.expandedHeight = null;
		}
	}
}
