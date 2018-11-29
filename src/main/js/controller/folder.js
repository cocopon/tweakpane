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
	+emitter: Emitter<EventName>;
	+folder: Folder;
	+view: FolderView;
	doc_: Document;
	ucList_: List<UiController>;

	constructor(document: Document, config: Config) {
		(this: any).onFolderChange_ = this.onFolderChange_.bind(this);
		(this: any).onInputChange_ = this.onInputChange_.bind(this);
		(this: any).onMonitorUpdate_ = this.onMonitorUpdate_.bind(this);

		(this: any).onTitleClick_ = this.onTitleClick_.bind(this);
		(this: any).onUiControllerListAppend_ = this.onUiControllerListAppend_.bind(this);

		this.emitter = new Emitter();

		this.folder = new Folder(
			config.title,
			FlowUtil.getOrDefault(config.expanded, true),
		);
		this.folder.emitter.on(
			'change',
			this.onFolderChange_,
		);

		this.ucList_ = new List();
		this.ucList_.emitter.on(
			'append',
			this.onUiControllerListAppend_,
		);

		this.doc_ = document;
		this.view = new FolderView(this.doc_, {
			folder: this.folder,
		});
		this.view.titleElement.addEventListener(
			'click',
			this.onTitleClick_,
		);
	}

	get document(): Document {
		return this.doc_;
	}

	get uiControllerList(): List<UiController> {
		return this.ucList_;
	}

	computeExpandedHeight_(): number {
		const elem = this.view.containerElement;

		let height = 0;
		DomUtil.disableTransitionTemporarily(elem, () => {
			// Expand folder
			const expanded = this.folder.expanded;
			this.folder.expandedHeight = null;
			this.folder.expanded = true;

			DomUtil.forceReflow(elem);

			// Compute height
			height = elem.getBoundingClientRect().height;

			// Restore expanded
			this.folder.expanded = expanded;

			DomUtil.forceReflow(elem);
		});

		return height;
	}

	onTitleClick_() {
		this.folder.expanded = !this.folder.expanded;
	}

	onUiControllerListAppend_(uc: UiController) {
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

	onInputChange_(value: mixed): void {
		this.emitter.emit('inputchange', [value]);
	}

	onMonitorUpdate_(value: mixed): void {
		this.emitter.emit('monitorupdate', [value]);
	}

	onFolderChange_(): void {
		this.emitter.emit('fold');
	}
}
