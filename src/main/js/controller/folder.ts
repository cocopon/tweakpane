import * as DomUtil from '../misc/dom-util';
import {TypeUtil} from '../misc/type-util';
import {Disposable} from '../model/disposable';
import {Folder} from '../model/folder';
import {UiControllerList} from '../model/ui-controller-list';
import {FolderView} from '../view/folder';
import {UiController} from './ui';

interface Config {
	disposable: Disposable;
	expanded?: boolean;
	title: string;
}

/**
 * @hidden
 */
export class FolderController {
	public readonly disposable: Disposable;
	public readonly folder: Folder;
	public readonly view: FolderView;
	private doc_: Document;
	private ucList_: UiControllerList;

	constructor(document: Document, config: Config) {
		this.onTitleClick_ = this.onTitleClick_.bind(this);
		this.onUiControllerListAdd_ = this.onUiControllerListAdd_.bind(this);
		this.onUiControllerListRemove_ = this.onUiControllerListRemove_.bind(this);

		this.disposable = config.disposable;
		this.folder = new Folder(
			config.title,
			TypeUtil.getOrDefault<boolean>(config.expanded, true),
		);

		this.ucList_ = new UiControllerList();
		this.ucList_.emitter.on('add', this.onUiControllerListAdd_);
		this.ucList_.emitter.on('remove', this.onUiControllerListRemove_);

		this.doc_ = document;
		this.view = new FolderView(this.doc_, {
			disposable: this.disposable,
			folder: this.folder,
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

	private onUiControllerListAdd_(
		_: UiControllerList,
		uc: UiController,
		index: number,
	) {
		this.view.containerElement.insertBefore(
			uc.view.element,
			this.view.containerElement.children[index],
		);
		this.folder.expandedHeight = this.computeExpandedHeight_();
	}

	private onUiControllerListRemove_(_: UiControllerList) {
		this.folder.expandedHeight = this.computeExpandedHeight_();
	}
}
