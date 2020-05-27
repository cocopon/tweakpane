import {FolderController} from '../controller/folder';
import {InputBindingController} from '../controller/input-binding';
import {MonitorBindingController} from '../controller/monitor-binding';
import {
	UiController,
	UiInputBinding,
	UiInputBindingController,
	UiMonitorBinding,
	UiMonitorBindingController,
} from '../controller/ui';
import {Emitter, EventTypeMap} from '../misc/emitter';
import {DisposableEvents} from './disposable';
import {FolderEvents} from './folder';
import {List, ListEvents} from './list';

/**
 * @hidden
 */
export interface UiControllerListEvents extends EventTypeMap {
	add: {
		index: number;
		uiController: UiController;
		sender: UiControllerList;
	};
	fold: {
		expanded: boolean;
		sender: UiControllerList;
	};
	inputchange: {
		inputBinding: UiInputBinding;
		sender: UiControllerList;
		value: unknown;
	};
	monitorupdate: {
		monitorBinding: UiMonitorBinding;
		sender: UiControllerList;
		value: unknown;
	};
	remove: {
		sender: UiControllerList;
	};
}

/**
 * @hidden
 */
export class UiControllerList {
	public readonly emitter: Emitter<UiControllerListEvents>;
	private ucList_: List<UiController>;

	constructor() {
		this.onItemFolderFold_ = this.onItemFolderFold_.bind(this);
		this.onSubitemFolderFold_ = this.onSubitemFolderFold_.bind(this);
		this.onSubitemInputChange_ = this.onSubitemInputChange_.bind(this);
		this.onSubitemMonitorUpdate_ = this.onSubitemMonitorUpdate_.bind(this);
		this.onItemInputChange_ = this.onItemInputChange_.bind(this);
		this.onListAdd_ = this.onListAdd_.bind(this);
		this.onListItemDispose_ = this.onListItemDispose_.bind(this);
		this.onListRemove_ = this.onListRemove_.bind(this);
		this.onItemMonitorUpdate_ = this.onItemMonitorUpdate_.bind(this);

		this.ucList_ = new List();
		this.emitter = new Emitter();

		this.ucList_.emitter.on('add', this.onListAdd_);
		this.ucList_.emitter.on('remove', this.onListRemove_);
	}

	get items(): UiController[] {
		return this.ucList_.items;
	}

	public add(uc: UiController, opt_index?: number): void {
		this.ucList_.add(uc, opt_index);
	}

	private onListAdd_(ev: ListEvents<UiController>['add']) {
		const uc = ev.item;

		this.emitter.emit('add', {
			index: ev.index,
			sender: this,
			uiController: uc,
		});
		uc.disposable.emitter.on('dispose', this.onListItemDispose_);

		if (uc instanceof InputBindingController) {
			const emitter = uc.binding.emitter;
			// TODO: Find more type-safe way
			(emitter.on as any)('change', this.onItemInputChange_);
		} else if (uc instanceof MonitorBindingController) {
			const emitter = uc.binding.emitter;
			// TODO: Find more type-safe way
			(emitter.on as any)('update', this.onItemMonitorUpdate_);
		} else if (uc instanceof FolderController) {
			uc.folder.emitter.on('change', this.onItemFolderFold_);

			const emitter = uc.uiControllerList.emitter;
			emitter.on('fold', this.onSubitemFolderFold_);
			emitter.on('inputchange', this.onSubitemInputChange_);
			emitter.on('monitorupdate', this.onSubitemMonitorUpdate_);
		}
	}

	private onListRemove_(_: ListEvents<UiController>['remove']) {
		this.emitter.emit('remove', {
			sender: this,
		});
	}

	private onListItemDispose_(_: DisposableEvents['dispose']): void {
		const disposedUcs = this.ucList_.items.filter((uc) => {
			return uc.disposable.disposed;
		});
		disposedUcs.forEach((uc) => {
			this.ucList_.remove(uc);
		});
	}

	private onItemInputChange_(
		ev: UiInputBindingController['binding']['emitter']['typeMap']['change'],
	): void {
		this.emitter.emit('inputchange', {
			inputBinding: ev.sender,
			sender: this,
			value: ev.rawValue,
		});
	}

	private onItemMonitorUpdate_(
		ev: UiMonitorBindingController['binding']['emitter']['typeMap']['update'],
	): void {
		this.emitter.emit('monitorupdate', {
			monitorBinding: ev.sender,
			sender: this,
			value: ev.rawValue,
		});
	}

	private onItemFolderFold_(ev: FolderEvents['change']) {
		this.emitter.emit('fold', {
			expanded: ev.expanded,
			sender: this,
		});
	}

	private onSubitemInputChange_(ev: UiControllerListEvents['inputchange']) {
		this.emitter.emit('inputchange', {
			inputBinding: ev.inputBinding,
			sender: this,
			value: ev.value,
		});
	}

	private onSubitemMonitorUpdate_(ev: UiControllerListEvents['monitorupdate']) {
		this.emitter.emit('monitorupdate', {
			monitorBinding: ev.monitorBinding,
			sender: this,
			value: ev.value,
		});
	}

	private onSubitemFolderFold_(ev: UiControllerListEvents['fold']) {
		this.emitter.emit('fold', {
			expanded: ev.expanded,
			sender: this,
		});
	}
}
