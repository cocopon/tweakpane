// @flow

import * as DomUtil from '../misc/dom-util';
import Emitter from '../misc/emitter';
import FlowUtil from '../misc/flow-util';
import Folder from '../model/folder';
import List from '../model/list';
import FolderView from '../view/folder';
import InputBindingController from './input-binding';
import MonitorBindingController from './monitor-binding';

import type {UiController} from './ui';

type Config = {
	expanded?: boolean,
	title: string,
};

export type EventName = 'fold' |
	'inputchange' |
	'monitorupdate';

export default class FolderController {
	doc_: Document;
	emitter_: Emitter<EventName>;
	folder_: Folder;
	ucList_: List<UiController>;
	view_: FolderView;

	constructor(document: Document, config: Config) {
		(this: any).onFolderChange_ = this.onFolderChange_.bind(this);
		(this: any).onInputChange_ = this.onInputChange_.bind(this);
		(this: any).onMonitorUpdate_ = this.onMonitorUpdate_.bind(this);

		(this: any).onTitleClick_ = this.onTitleClick_.bind(this);
		(this: any).onUiControllerListAppend_ = this.onUiControllerListAppend_.bind(this);

		this.emitter_ = new Emitter();

		this.folder_ = new Folder(
			config.title,
			FlowUtil.getOrDefault(config.expanded, true),
		);
		this.folder_.emitter.on(
			'change',
			this.onFolderChange_,
		);

		this.ucList_ = new List();
		this.ucList_.emitter.on(
			'append',
			this.onUiControllerListAppend_,
		);

		this.doc_ = document;
		this.view_ = new FolderView(this.doc_, {
			folder: this.folder_,
		});
		this.view_.titleElement.addEventListener(
			'click',
			this.onTitleClick_,
		);
	}

	get document(): Document {
		return this.doc_;
	}

	get emitter(): Emitter<EventName> {
		return this.emitter_;
	}

	get folder(): Folder {
		return this.folder_;
	}

	get view(): FolderView {
		return this.view_;
	}

	get uiControllerList(): List<UiController> {
		return this.ucList_;
	}

	computeExpandedHeight_(): number {
		const elem = this.view_.containerElement;

		let height = 0;
		DomUtil.disableTransitionTemporarily(elem, () => {
			// Expand folder
			const expanded = this.folder_.expanded;
			this.folder_.expandedHeight = null;
			this.folder_.expanded = true;

			DomUtil.forceReflow(elem);

			// Compute height
			height = elem.getBoundingClientRect().height;

			// Restore expanded
			this.folder_.expanded = expanded;

			DomUtil.forceReflow(elem);
		});

		return height;
	}

	onTitleClick_() {
		this.folder_.expanded = !this.folder_.expanded;
	}

	onUiControllerListAppend_(uc: UiController) {
		if (uc instanceof InputBindingController) {
			const emitter = uc.binding.value.emitter;
			emitter.on('change', this.onInputChange_);
		} else if (uc instanceof MonitorBindingController) {
			const emitter = uc.binding.value.emitter;
			emitter.on('update', this.onMonitorUpdate_);
		}

		this.view_.containerElement.appendChild(uc.view.element);
		this.folder_.expandedHeight = this.computeExpandedHeight_();
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
}
