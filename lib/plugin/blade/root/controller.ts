import {isEmpty} from '../../../misc/type-util';
import {forceReflow, insertElementAt} from '../../common/dom-util';
import {BladeController, setUpBladeView} from '../common/controller/blade';
import {
	computeExpandedFolderHeight,
	updateAllItemsPositions,
} from '../common/controller/container-util';
import {Blade} from '../common/model/blade';
import {BladeRack, BladeRackEvents} from '../common/model/blade-rack';
import {Folder, FolderEvents} from '../folder/model/folder';
import {RootView} from './view';

interface Config {
	expanded?: boolean;
	title?: string;
	blade: Blade;
}

function createFolder(config: Config): Folder | null {
	if (!config.title) {
		return null;
	}

	return new Folder(config.title, config.expanded ?? true);
}

/**
 * @hidden
 */
export class RootController implements BladeController {
	public readonly blade: Blade;
	public readonly bladeRack: BladeRack;
	public readonly folder: Folder | null;
	public readonly view: RootView;
	private doc_: Document;

	constructor(doc: Document, config: Config) {
		this.onContainerTransitionEnd_ = this.onContainerTransitionEnd_.bind(this);
		this.onFolderBeforeChange_ = this.onFolderBeforeChange_.bind(this);
		this.onTitleClick_ = this.onTitleClick_.bind(this);
		this.onRackAdd_ = this.onRackAdd_.bind(this);
		this.onRackItemLayout_ = this.onRackItemLayout_.bind(this);
		this.onRackRemove_ = this.onRackRemove_.bind(this);

		this.folder = createFolder(config);
		if (this.folder) {
			this.folder.emitter.on('beforechange', this.onFolderBeforeChange_);
		}

		this.bladeRack = new BladeRack();
		this.bladeRack.emitter.on('add', this.onRackAdd_);
		this.bladeRack.emitter.on('itemlayout', this.onRackItemLayout_);
		this.bladeRack.emitter.on('remove', this.onRackRemove_);

		this.doc_ = doc;
		this.blade = config.blade;
		this.view = new RootView(this.doc_, {
			folder: this.folder,
		});
		if (this.view.titleElement) {
			this.view.titleElement.addEventListener('click', this.onTitleClick_);
		}
		this.view.containerElement.addEventListener(
			'transitionend',
			this.onContainerTransitionEnd_,
		);
		setUpBladeView(this.view, this.blade);
	}

	get document(): Document {
		return this.doc_;
	}

	private onFolderBeforeChange_(ev: FolderEvents['beforechange']): void {
		if (ev.propertyName !== 'expanded') {
			return;
		}
		const folder = this.folder;
		if (!folder) {
			return;
		}

		if (isEmpty(folder.expandedHeight)) {
			folder.expandedHeight = computeExpandedFolderHeight(
				folder,
				this.view.containerElement,
			);
		}

		folder.shouldFixHeight = true;
		forceReflow(this.view.containerElement);
	}

	private applyRackChange_(): void {
		updateAllItemsPositions(this.bladeRack);
	}

	private onRackAdd_(ev: BladeRackEvents['add']) {
		insertElementAt(
			this.view.containerElement,
			ev.blade.view.element,
			ev.index,
		);
		this.applyRackChange_();
	}

	private onRackRemove_(_: BladeRackEvents['remove']) {
		this.applyRackChange_();
	}

	private onRackItemLayout_(_: BladeRackEvents['itemlayout']) {
		this.applyRackChange_();
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
