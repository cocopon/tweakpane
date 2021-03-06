import {Class} from '../../../../misc/type-util';
import {InputBinding, InputBindingEvents} from '../../../common/binding/input';
import {
	MonitorBinding,
	MonitorBindingEvents,
} from '../../../common/binding/monitor';
import {Emitter} from '../../../common/model/emitter';
import {FolderController} from '../../folder/controller';
import {Folder, FolderEvents} from '../../folder/model/folder';
import {BladeController} from '../controller/blade';
import {InputBindingController} from '../controller/input-binding';
import {MonitorBindingController} from '../controller/monitor-binding';
import {BladeEvents} from './blade';
import {List, ListEvents} from './list';

/**
 * @hidden
 */
export interface BladeRackEvents {
	add: {
		bladeController: BladeController;
		index: number;
		sender: BladeRack;
	};
	remove: {
		sender: BladeRack;
	};

	inputchange: {
		bindingController: InputBindingController<unknown>;
		sender: BladeRack;
	};
	itemfold: {
		folderController: FolderController;
		sender: BladeRack;
	};
	itemlayout: {
		sender: BladeRack;
	};
	monitorupdate: {
		bindingController: MonitorBindingController<unknown>;
		sender: BladeRack;
	};
}

function findInputBindingController<In>(
	bcs: InputBindingController<In>[],
	b: InputBinding<In>,
): InputBindingController<In> | null {
	for (let i = 0; i < bcs.length; i++) {
		const bc = bcs[i];
		if (bc instanceof InputBindingController && bc.binding === b) {
			return bc;
		}
	}
	return null;
}

function findMonitorBindingController<In>(
	bcs: MonitorBindingController<In>[],
	b: MonitorBinding<In>,
): MonitorBindingController<In> | null {
	for (let i = 0; i < bcs.length; i++) {
		const bc = bcs[i];
		if (bc instanceof MonitorBindingController && bc.binding === b) {
			return bc;
		}
	}
	return null;
}

function findFolderController(
	bcs: FolderController[],
	f: Folder,
): FolderController | null {
	for (let i = 0; i < bcs.length; i++) {
		const bc = bcs[i];
		if (bc instanceof FolderController && bc.folder === f) {
			return bc;
		}
	}
	return null;
}

/**
 * @hidden
 */
export class BladeRack {
	public readonly emitter: Emitter<BladeRackEvents>;
	private bcList_: List<BladeController>;

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

		this.bcList_ = new List();
		this.emitter = new Emitter();

		this.bcList_.emitter.on('add', this.onListAdd_);
		this.bcList_.emitter.on('remove', this.onListRemove_);
	}

	get items(): BladeController[] {
		return this.bcList_.items;
	}

	public add(bc: BladeController, opt_index?: number): void {
		this.bcList_.add(bc, opt_index);
	}

	public find<B extends BladeController>(controllerClass: Class<B>): B[] {
		return this.items.reduce((results, bc) => {
			if (bc instanceof FolderController) {
				results.push(...bc.bladeRack.find(controllerClass));
			}

			if (bc instanceof controllerClass) {
				results.push(bc);
			}

			return results;
		}, [] as B[]);
	}

	private onListAdd_(ev: ListEvents<BladeController>['add']) {
		const bc = ev.item;

		this.emitter.emit('add', {
			bladeController: bc,
			index: ev.index,
			sender: this,
		});
		bc.blade.emitter.on('dispose', this.onListItemDispose_);
		bc.blade.emitter.on('change', this.onListItemLayout_);

		if (bc instanceof InputBindingController) {
			bc.binding.emitter.on('change', this.onItemInputChange_);
		} else if (bc instanceof MonitorBindingController) {
			bc.binding.emitter.on('update', this.onItemMonitorUpdate_);
		} else if (bc instanceof FolderController) {
			bc.folder.emitter.on('change', this.onItemFolderFold_);

			const emitter = bc.bladeRack.emitter;
			emitter.on('itemfold', this.onSubitemFolderFold_);
			emitter.on('itemlayout', this.onSubitemLayout_);
			emitter.on('inputchange', this.onSubitemInputChange_);
			emitter.on('monitorupdate', this.onSubitemMonitorUpdate_);
		}
	}

	private onListRemove_(_: ListEvents<BladeController>['remove']) {
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
		const disposedUcs = this.bcList_.items.filter((bc) => {
			return bc.blade.disposed;
		});
		disposedUcs.forEach((bc) => {
			this.bcList_.remove(bc);
		});
	}

	private onItemInputChange_(ev: InputBindingEvents<unknown>['change']): void {
		const ibc = findInputBindingController(
			this.find(InputBindingController),
			ev.sender,
		);
		if (!ibc) {
			return;
		}

		this.emitter.emit('inputchange', {
			bindingController: ibc,
			sender: this,
		});
	}

	private onItemMonitorUpdate_(
		ev: MonitorBindingEvents<unknown>['update'],
	): void {
		const mbc = findMonitorBindingController(
			this.find(MonitorBindingController),
			ev.sender,
		);
		if (!mbc) {
			return;
		}

		this.emitter.emit('monitorupdate', {
			bindingController: mbc,
			sender: this,
		});
	}

	private onItemFolderFold_(ev: FolderEvents['change']) {
		if (ev.propertyName !== 'expanded') {
			return;
		}

		const fc = findFolderController(this.find(FolderController), ev.sender);
		if (fc) {
			this.emitter.emit('itemfold', {
				folderController: fc,
				sender: this,
			});
		}
	}

	private onSubitemLayout_(_: BladeRackEvents['itemlayout']) {
		this.emitter.emit('itemlayout', {
			sender: this,
		});
	}

	private onSubitemInputChange_(ev: BladeRackEvents['inputchange']) {
		this.emitter.emit('inputchange', {
			bindingController: ev.bindingController,
			sender: this,
		});
	}

	private onSubitemMonitorUpdate_(ev: BladeRackEvents['monitorupdate']) {
		this.emitter.emit('monitorupdate', {
			bindingController: ev.bindingController,
			sender: this,
		});
	}

	private onSubitemFolderFold_(ev: BladeRackEvents['itemfold']) {
		this.emitter.emit('itemfold', {
			folderController: ev.folderController,
			sender: this,
		});
	}
}
