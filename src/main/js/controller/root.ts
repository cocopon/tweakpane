// @flow

import Emitter from '../misc/emitter';
import FlowUtil from '../misc/flow-util';
import Folder from '../model/folder';
import List from '../model/list';
import RootView from '../view/root';
import FolderController from './folder';
import InputBindingController from './input-binding';
import MonitorBindingController from './monitor-binding';

import {UiController} from './ui';

interface Config {
	expanded?: boolean;
	title?: string;
}

export type EventName = 'fold' | 'inputchange' | 'monitorupdate';

function createFolder(config: Config): Folder | null {
	if (!config.title) {
		return null;
	}

	return new Folder(
		config.title,
		FlowUtil.getOrDefault<boolean>(config.expanded, true),
	);
}

export default class RootController {
	public readonly emitter: Emitter<EventName>;
	public readonly folder: Folder | null;
	public readonly view: RootView;
	private doc_: Document;
	private ucList_: List<UiController>;

	constructor(document: Document, config: Config) {
		this.onFolderChange_ = this.onFolderChange_.bind(this);
		this.onRootFolderChange_ = this.onRootFolderChange_.bind(this);
		this.onTitleClick_ = this.onTitleClick_.bind(this);
		this.onUiControllerListAppend_ = this.onUiControllerListAppend_.bind(this);
		this.onInputChange_ = this.onInputChange_.bind(this);
		this.onMonitorUpdate_ = this.onMonitorUpdate_.bind(this);

		this.emitter = new Emitter();

		this.folder = createFolder(config);

		this.ucList_ = new List();
		this.ucList_.emitter.on('append', this.onUiControllerListAppend_);

		this.doc_ = document;
		this.view = new RootView(this.doc_, {
			folder: this.folder,
		});
		if (this.view.titleElement) {
			this.view.titleElement.addEventListener('click', this.onTitleClick_);
		}
		if (this.folder) {
			this.folder.emitter.on('change', this.onRootFolderChange_);
		}
	}

	get document(): Document {
		return this.doc_;
	}

	get uiControllerList(): List<UiController> {
		return this.ucList_;
	}

	private onUiControllerListAppend_(uc: UiController) {
		if (uc instanceof InputBindingController) {
			const emitter = uc.binding.value.emitter;
			emitter.on('change', this.onInputChange_);
		} else if (uc instanceof MonitorBindingController) {
			const emitter = uc.binding.value.emitter;
			emitter.on('update', this.onMonitorUpdate_);
		} else if (uc instanceof FolderController) {
			const emitter = uc.emitter;
			emitter.on('fold', this.onFolderChange_);
			emitter.on('inputchange', this.onInputChange_);
			emitter.on('monitorupdate', this.onMonitorUpdate_);
		}

		this.view.containerElement.appendChild(uc.view.element);
	}

	private onTitleClick_() {
		if (this.folder) {
			this.folder.expanded = !this.folder.expanded;
		}
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

	private onRootFolderChange_(): void {
		this.emitter.emit('fold');
	}
}
