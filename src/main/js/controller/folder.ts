import * as DomUtil from '../misc/dom-util';
import {Emitter} from '../misc/emitter';
import {TypeUtil} from '../misc/type-util';
import {Folder} from '../model/folder';
import {List} from '../model/list';
import {FolderView} from '../view/folder';
import {InputBindingController} from './input-binding';
import {MonitorBindingController} from './monitor-binding';
import {UiController} from './ui';

interface Config {
	expanded?: boolean;
	title: string;
}

export type EventName = 'fold' | 'inputchange' | 'monitorupdate';

/**
 * @hidden
 */
export class FolderController {
	public readonly emitter: Emitter<EventName>;
	public readonly folder: Folder;
	public readonly view: FolderView;
	private doc_: Document;
	private ucList_: List<UiController>;

	constructor(document: Document, config: Config) {
		this.onFolderChange_ = this.onFolderChange_.bind(this);
		this.onInputChange_ = this.onInputChange_.bind(this);
		this.onMonitorUpdate_ = this.onMonitorUpdate_.bind(this);

		this.onTitleClick_ = this.onTitleClick_.bind(this);
		this.onUiControllerListAppend_ = this.onUiControllerListAppend_.bind(this);

		this.emitter = new Emitter();

		this.folder = new Folder(
			config.title,
			TypeUtil.getOrDefault<boolean>(config.expanded, true),
		);
		this.folder.emitter.on('change', this.onFolderChange_);

		this.ucList_ = new List();
		this.ucList_.emitter.on('append', this.onUiControllerListAppend_);

		this.doc_ = document;
		this.view = new FolderView(this.doc_, {
			folder: this.folder,
		});
		this.view.titleElement.addEventListener('click', this.onTitleClick_);
	}

	get document(): Document {
		return this.doc_;
	}

	get uiControllerList(): List<UiController> {
		return this.ucList_;
	}

	public dispose(): void {
		this.view.disposable.dispose();
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

	private onUiControllerListAppend_(uc: UiController) {
		if (uc instanceof InputBindingController) {
			const emitter = uc.binding.value.emitter;
			emitter.on('change', this.onInputChange_);
		} else if (uc instanceof MonitorBindingController) {
			const emitter = uc.binding.value.emitter;
			emitter.on('update', this.onMonitorUpdate_);
		}

		this.view.containerElement.appendChild(uc.view.element);
		this.folder.expandedHeight = this.computeExpandedHeight_();
	}

	private onInputChange_(value: unknown): void {
		this.emitter.emit('inputchange', [value]);
	}

	private onMonitorUpdate_(value: unknown): void {
		this.emitter.emit('monitorupdate', [value]);
	}

	private onFolderChange_(): void {
		this.emitter.emit('fold');
	}
}
