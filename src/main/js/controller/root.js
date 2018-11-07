// @flow

import Emitter from '../misc/emitter';
import FlowUtil from '../misc/flow-util';
import Folder from '../model/folder';
import List from '../model/list';
import RootView from '../view/root';
import FolderController from './folder';
import InputBindingController from './input-binding';
import MonitorBindingController from './monitor-binding';

import type {UiController} from './ui';

type Config = {
	expanded?: boolean,
	title?: string,
};

export type EventName = 'fold' |
	'inputchange' |
	'monitorupdate';

function createFolder(config: Config): ?Folder {
	if (!config.title) {
		return null;
	}

	return new Folder(
		config.title,
		FlowUtil.getOrDefault(config.expanded, true),
	);
}

export default class RootController {
	doc_: Document;
	emitter_: Emitter<EventName>;
	folder_: ?Folder;
	ucList_: List<UiController>;
	view_: RootView;

	constructor(document: Document, config: Config) {
		(this: any).onFolderChange_ = this.onFolderChange_.bind(this);
		(this: any).onRootFolderChange_ = this.onRootFolderChange_.bind(this);
		(this: any).onTitleClick_ = this.onTitleClick_.bind(this);
		(this: any).onUiControllerListAppend_ = this.onUiControllerListAppend_.bind(this);
		(this: any).onInputChange_ = this.onInputChange_.bind(this);
		(this: any).onMonitorUpdate_ = this.onMonitorUpdate_.bind(this);

		this.emitter_ = new Emitter();

		this.folder_ = createFolder(config);

		this.ucList_ = new List();
		this.ucList_.emitter.on(
			'append',
			this.onUiControllerListAppend_,
		);

		this.doc_ = document;
		this.view_ = new RootView(this.doc_, {
			folder: this.folder_,
		});
		if (this.view_.titleElement) {
			this.view_.titleElement.addEventListener(
				'click',
				this.onTitleClick_,
			);
		}
		if (this.folder_) {
			this.folder_.emitter.on(
				'change',
				this.onRootFolderChange_,
			);
		}
	}

	get document(): Document {
		return this.doc_;
	}

	get emitter(): Emitter<EventName> {
		return this.emitter_;
	}

	get view(): RootView {
		return this.view_;
	}

	get uiControllerList(): List<UiController> {
		return this.ucList_;
	}

	get folder(): ?Folder {
		return this.folder_;
	}

	onUiControllerListAppend_(uc: UiController) {
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

		this.view_.containerElement.appendChild(uc.view.element);
	}

	onTitleClick_() {
		if (this.folder_) {
			this.folder_.expanded = !this.folder_.expanded;
		}
	}

	onInputChange_(value: mixed): void {
		this.emitter_.emit('inputchange', [value]);
	}

	onMonitorUpdate_(value: mixed): void {
		this.emitter_.emit('monitorupdate', [value]);
	}

	onFolderChange_(): void {
		this.emitter_.emit('fold');
	}

	onRootFolderChange_(): void {
		this.emitter_.emit('fold');
	}
}
