import {InputBinding, InputBindingEvents} from '../../../common/binding/input';
import {
	MonitorBinding,
	MonitorBindingEvents,
} from '../../../common/binding/monitor';
import {Emitter} from '../../../common/model/emitter';
import {FolderEvents} from '../../../common/model/folder';
import {List, ListEvents} from '../../../common/model/list';
import {FolderController} from '../../folder/controller';
import {InputBindingController} from '../controller/input-binding';
import {MonitorBindingController} from '../controller/monitor-binding';
import {UiController} from '../controller/ui';
import {BladeEvents} from './blade';

/**
 * @hidden
 */
export interface UiContainerEvents {
	add: {
		index: number;
		uiController: UiController;
		sender: UiContainer;
	};
	remove: {
		sender: UiContainer;
	};

	inputchange: {
		inputBinding: InputBinding<unknown, unknown>;
		sender: UiContainer;
		value: unknown;
	};
	itemfold: {
		expanded: boolean;
		sender: UiContainer;
	};
	itemlayout: {
		sender: UiContainer;
	};
	monitorupdate: {
		monitorBinding: MonitorBinding<unknown>;
		sender: UiContainer;
		value: unknown;
	};
}

/**
 * @hidden
 */
export class UiContainer {
	public readonly emitter: Emitter<UiContainerEvents>;
	private ucList_: List<UiController>;

	constructor() {
		this.onItemFolderFold_ = this.onItemFolderFold_.bind(this);
		this.onListItemLayout_ = this.onListItemLayout_.bind(this);
		this.onSubitemLayout_ = this.onSubitemLayout_.bind(this);
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
		uc.blade.emitter.on('dispose', this.onListItemDispose_);
		uc.blade.emitter.on('change', this.onListItemLayout_);

		if (uc instanceof InputBindingController) {
			const emitter = uc.binding.emitter;
			// TODO: Find more type-safe way
			(emitter.on as any)('change', this.onItemInputChange_);
		} else if (uc instanceof MonitorBindingController) {
			const emitter = uc.binding.emitter;
			// TODO: Find more type-safe way
			emitter.on('update', this.onItemMonitorUpdate_);
		} else if (uc instanceof FolderController) {
			uc.folder.emitter.on('change', this.onItemFolderFold_);

			const emitter = uc.uiContainer.emitter;
			emitter.on('itemfold', this.onSubitemFolderFold_);
			emitter.on('itemlayout', this.onSubitemLayout_);
			emitter.on('inputchange', this.onSubitemInputChange_);
			emitter.on('monitorupdate', this.onSubitemMonitorUpdate_);
		}
	}

	private onListRemove_(_: ListEvents<UiController>['remove']) {
		this.emitter.emit('remove', {
			sender: this,
		});
	}

	private onListItemLayout_(ev: BladeEvents['change']) {
		if (ev.propertyName === 'hidden' || ev.propertyName === 'positions') {
			this.emitter.emit('itemlayout', {
				sender: this,
			});
		}
	}

	private onListItemDispose_(_: BladeEvents['dispose']): void {
		const disposedUcs = this.ucList_.items.filter((uc) => {
			return uc.blade.disposed;
		});
		disposedUcs.forEach((uc) => {
			this.ucList_.remove(uc);
		});
	}

	private onItemInputChange_(
		ev: InputBindingEvents<unknown, unknown>['change'],
	): void {
		this.emitter.emit('inputchange', {
			inputBinding: ev.sender,
			sender: this,
			value: ev.rawValue,
		});
	}

	private onItemMonitorUpdate_(
		ev: MonitorBindingEvents<unknown>['update'],
	): void {
		this.emitter.emit('monitorupdate', {
			monitorBinding: ev.sender,
			sender: this,
			value: ev.rawValue,
		});
	}

	private onItemFolderFold_(ev: FolderEvents['change']) {
		if (ev.propertyName !== 'expanded') {
			return;
		}
		this.emitter.emit('itemfold', {
			expanded: ev.sender.expanded,
			sender: this,
		});
	}

	private onSubitemLayout_(_: UiContainerEvents['itemlayout']) {
		this.emitter.emit('itemlayout', {
			sender: this,
		});
	}

	private onSubitemInputChange_(ev: UiContainerEvents['inputchange']) {
		this.emitter.emit('inputchange', {
			inputBinding: ev.inputBinding,
			sender: this,
			value: ev.value,
		});
	}

	private onSubitemMonitorUpdate_(ev: UiContainerEvents['monitorupdate']) {
		this.emitter.emit('monitorupdate', {
			monitorBinding: ev.monitorBinding,
			sender: this,
			value: ev.value,
		});
	}

	private onSubitemFolderFold_(ev: UiContainerEvents['itemfold']) {
		this.emitter.emit('itemfold', {
			expanded: ev.expanded,
			sender: this,
		});
	}
}
