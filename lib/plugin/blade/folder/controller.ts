import {isEmpty} from '../../../misc/type-util';
import {
	disableTransitionTemporarily,
	forceReflow,
	insertElementAt,
} from '../../common/dom-util';
import {ViewProps} from '../../common/model/view-props';
import {
	BladeController,
	setUpBladeController,
} from '../common/controller/blade';
import {Blade} from '../common/model/blade';
import {BladePosition} from '../common/model/blade-positions';
import {BladeRack, BladeRackEvents} from '../common/model/blade-rack';
import {Folder, FolderEvents} from './model/folder';
import {FolderView} from './view';

interface Config {
	expanded?: boolean;
	title: string;
	blade: Blade;
	viewProps: ViewProps;

	hidesTitle?: boolean;
	viewName?: string;
}

function computeExpandedFolderHeight(
	folder: Folder,
	containerElement: HTMLElement,
): number {
	let height = 0;

	disableTransitionTemporarily(containerElement, () => {
		// Expand folder temporarily
		folder.expandedHeight = null;
		folder.temporaryExpanded = true;

		forceReflow(containerElement);

		// Compute height
		height = containerElement.clientHeight;

		// Restore expanded
		folder.temporaryExpanded = null;

		forceReflow(containerElement);
	});

	return height;
}

/**
 * @hidden
 */
export class FolderController implements BladeController {
	public readonly blade: Blade;
	public readonly bladeRack: BladeRack;
	public readonly folder: Folder;
	public readonly view: FolderView;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: Config) {
		this.onContainerTransitionEnd_ = this.onContainerTransitionEnd_.bind(this);
		this.onFolderBeforeChange_ = this.onFolderBeforeChange_.bind(this);
		this.onTitleClick_ = this.onTitleClick_.bind(this);
		this.onRackAdd_ = this.onRackAdd_.bind(this);
		this.onRackLayout_ = this.onRackLayout_.bind(this);
		this.onRackRemove_ = this.onRackRemove_.bind(this);

		this.blade = config.blade;
		this.viewProps = config.viewProps;

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
			viewProps: this.viewProps,
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

	public onDispose() {
		for (let i = this.bladeRack.items.length - 1; i >= 0; i--) {
			const bc = this.bladeRack.items[i];
			bc.blade.dispose();
		}
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
		const visibleItems = this.bladeRack.items.filter(
			(bc) => !bc.viewProps.get('hidden'),
		);
		const firstVisibleItem = visibleItems[0];
		const lastVisibleItem = visibleItems[visibleItems.length - 1];

		this.bladeRack.items.forEach((bc) => {
			const ps: BladePosition[] = [];
			if (bc === firstVisibleItem) {
				ps.push('first');
			}
			if (bc === lastVisibleItem) {
				ps.push('last');
			}
			bc.blade.positions = ps;
		});
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
