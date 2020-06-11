import * as DomUtil from '../misc/dom-util';
import {TypeUtil} from '../misc/type-util';
import {Folder} from '../model/folder';
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
		this.onTitleClick_ = this.onTitleClick_.bind(this);
		this.onUiContainerAdd_ = this.onUiContainerAdd_.bind(this);
		this.onUiContainerItemLayout_ = this.onUiContainerItemLayout_.bind(this);
		this.onUiContainerRemove_ = this.onUiContainerRemove_.bind(this);

		this.folder = createFolder(config);

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
	}

	get document(): Document {
		return this.doc_;
	}

	get uiContainer(): UiContainer {
		return this.ucList_;
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
}
