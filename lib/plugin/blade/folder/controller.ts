import {isEmpty} from '../../../misc/type-util';
import {forceReflow, insertElementAt} from '../../common/dom-util';
import {
	BladeController,
	setUpBladeController,
} from '../common/controller/blade';
import {
	computeExpandedFolderHeight,
	updateAllItemsPositions,
} from '../common/controller/container-util';
import {Blade} from '../common/model/blade';
import {BladeRack, BladeRackEvents} from '../common/model/blade-rack';
import {Folder, FolderEvents} from './model/folder';
import {FolderView} from './view';

interface Config {
	expanded?: boolean;
	title: string;
	blade: Blade;

	hidesTitle?: boolean;
	viewName?: string;
}

/**
 * @hidden
 */
export class FolderController implements BladeController {
	public readonly blade: Blade;
	public readonly bladeRack: BladeRack;
	public readonly folder: Folder;
	public readonly view: FolderView;

	constructor(doc: Document, config: Config) {
		this.onContainerTransitionEnd_ = this.onContainerTransitionEnd_.bind(this);
		this.onFolderBeforeChange_ = this.onFolderBeforeChange_.bind(this);
		this.onTitleClick_ = this.onTitleClick_.bind(this);
		this.onRackAdd_ = this.onRackAdd_.bind(this);
		this.onRackLayout_ = this.onRackLayout_.bind(this);
		this.onRackRemove_ = this.onRackRemove_.bind(this);

		this.blade = config.blade;
		this.folder = new Folder(config.title, config.expanded ?? true);
		this.folder.emitter.on('beforechange', this.onFolderBeforeChange_);

		const rack = new BladeRack();
		rack.emitter.on('add', this.onRackAdd_);
		rack.emitter.on('layout', this.onRackLayout_);
		rack.emitter.on('remove', this.onRackRemove_);
		this.bladeRack = rack;

		this.view = new FolderView(doc, {
			folder: this.folder,
			hidesTitle: config.hidesTitle,
			viewName: config.viewName,
		});
		this.view.titleElement.addEventListener('click', this.onTitleClick_);
		this.view.containerElement.addEventListener(
			'transitionend',
			this.onContainerTransitionEnd_,
		);
		setUpBladeController(this);
	}

	get document(): Document {
		return this.view.element.ownerDocument;
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

	private applyRackChange_(): void {
		updateAllItemsPositions(this.bladeRack);
	}

	private onRackAdd_(ev: BladeRackEvents['add']) {
		if (!ev.isRoot) {
			return;
		}
		insertElementAt(
			this.view.containerElement,
			ev.bladeController.view.element,
			ev.index,
		);
		this.applyRackChange_();
	}

	private onRackRemove_(ev: BladeRackEvents['remove']) {
		if (!ev.isRoot) {
			return;
		}
		this.applyRackChange_();
	}

	private onRackLayout_(_: BladeRackEvents['layout']) {
		this.applyRackChange_();
	}

	private onContainerTransitionEnd_(ev: TransitionEvent): void {
		if (ev.propertyName !== 'height') {
			return;
		}

		this.folder.shouldFixHeight = false;
		this.folder.expandedHeight = null;
	}
}
