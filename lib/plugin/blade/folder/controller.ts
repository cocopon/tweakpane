import {isEmpty} from '../../../misc/type-util';
import {forceReflow, insertElementAt} from '../../common/dom-util';
import {Folder, FolderEvents} from '../../common/model/folder';
import {BladeController, setUpBladeView} from '../common/controller/blade';
import {
	computeExpandedFolderHeight,
	updateAllItemsPositions,
} from '../common/controller/container-util';
import {Blade} from '../common/model/blade';
import {UiContainer, UiContainerEvents} from '../common/model/ui-container';
import {FolderView} from './view';

interface Config {
	expanded?: boolean;
	title: string;
	blade: Blade;
}

/**
 * @hidden
 */
export class FolderController implements BladeController {
	public readonly folder: Folder;
	public readonly view: FolderView;
	public readonly blade: Blade;
	private doc_: Document;
	private ucList_: UiContainer;

	constructor(doc: Document, config: Config) {
		this.onContainerTransitionEnd_ = this.onContainerTransitionEnd_.bind(this);
		this.onFolderBeforeChange_ = this.onFolderBeforeChange_.bind(this);
		this.onTitleClick_ = this.onTitleClick_.bind(this);
		this.onUiContainerAdd_ = this.onUiContainerAdd_.bind(this);
		this.onUiContainerItemLayout_ = this.onUiContainerItemLayout_.bind(this);
		this.onUiContainerRemove_ = this.onUiContainerRemove_.bind(this);

		this.blade = config.blade;
		this.folder = new Folder(config.title, config.expanded ?? true);
		this.folder.emitter.on('beforechange', this.onFolderBeforeChange_);

		this.ucList_ = new UiContainer();
		this.ucList_.emitter.on('add', this.onUiContainerAdd_);
		this.ucList_.emitter.on('itemlayout', this.onUiContainerItemLayout_);
		this.ucList_.emitter.on('remove', this.onUiContainerRemove_);

		this.doc_ = doc;
		this.view = new FolderView(this.doc_, {
			folder: this.folder,
		});
		this.view.titleElement.addEventListener('click', this.onTitleClick_);
		this.view.containerElement.addEventListener(
			'transitionend',
			this.onContainerTransitionEnd_,
		);
		setUpBladeView(this.view, this.blade);
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

		if (isEmpty(this.folder.expandedHeight)) {
			this.folder.expandedHeight = computeExpandedFolderHeight(
				this.folder,
				this.view.containerElement,
			);
		}

		this.folder.shouldFixHeight = true;
		forceReflow(this.view.containerElement);
	}

	private onTitleClick_() {
		this.folder.expanded = !this.folder.expanded;
	}

	private applyUiContainerChange_(): void {
		updateAllItemsPositions(this.uiContainer);
	}

	private onUiContainerAdd_(ev: UiContainerEvents['add']) {
		insertElementAt(
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
