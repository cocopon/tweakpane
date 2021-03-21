import {Class, forceCast} from '../../../../misc/type-util';
import {InputBinding, InputBindingEvents} from '../../../common/binding/input';
import {
	MonitorBinding,
	MonitorBindingEvents,
} from '../../../common/binding/monitor';
import {Emitter} from '../../../common/model/emitter';
import {TpError} from '../../../common/tp-error';
import {FolderController} from '../../folder/controller';
import {Folder, FolderEvents} from '../../folder/model/folder';
import {BladeController} from '../controller/blade';
import {InputBindingController} from '../controller/input-binding';
import {MonitorBindingController} from '../controller/monitor-binding';
import {BladeEvents} from './blade';
import {NestedOrderedSet, NestedOrderedSetEvents} from './nested-ordered-set';

/**
 * @hidden
 */
export interface BladeRackEvents {
	add: {
		bladeController: BladeController;
		index: number;
		isRoot: boolean;
		sender: BladeRack;
	};
	remove: {
		isRoot: boolean;
		sender: BladeRack;
	};

	folderfold: {
		folderController: FolderController;
		sender: BladeRack;
	};
	inputchange: {
		bindingController: InputBindingController<unknown>;
		sender: BladeRack;
	};
	layout: {
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
	private bcList_: NestedOrderedSet<BladeController>;

	constructor() {
		this.onListAdd_ = this.onListAdd_.bind(this);
		this.onListRemove_ = this.onListRemove_.bind(this);

		this.onItemDispose_ = this.onItemDispose_.bind(this);
		this.onItemLayout_ = this.onItemLayout_.bind(this);
		this.onItemFolderFold_ = this.onItemFolderFold_.bind(this);
		this.onItemInputChange_ = this.onItemInputChange_.bind(this);
		this.onItemMonitorUpdate_ = this.onItemMonitorUpdate_.bind(this);

		this.onSubitemLayout_ = this.onSubitemLayout_.bind(this);
		this.onSubitemFolderFold_ = this.onSubitemFolderFold_.bind(this);
		this.onSubitemInputChange_ = this.onSubitemInputChange_.bind(this);
		this.onSubitemMonitorUpdate_ = this.onSubitemMonitorUpdate_.bind(this);

		this.bcList_ = new NestedOrderedSet((bc) =>
			bc instanceof FolderController ? bc.bladeRack.bcList_ : null,
		);
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
		return forceCast(
			this.bcList_.allItems().filter((bc) => {
				return bc instanceof controllerClass;
			}),
		);
	}

	private onListAdd_(ev: NestedOrderedSetEvents<BladeController>['add']) {
		const isRoot = ev.target === ev.root;
		this.emitter.emit('add', {
			bladeController: ev.item,
			index: ev.index,
			isRoot: isRoot,
			sender: this,
		});

		if (!isRoot) {
			return;
		}

		const bc = ev.item;
		bc.blade.emitter.on('dispose', this.onItemDispose_);
		bc.blade.emitter.on('change', this.onItemLayout_);

		if (bc instanceof InputBindingController) {
			bc.binding.emitter.on('change', this.onItemInputChange_);
		} else if (bc instanceof MonitorBindingController) {
			bc.binding.emitter.on('update', this.onItemMonitorUpdate_);
		} else if (bc instanceof FolderController) {
			bc.folder.emitter.on('change', this.onItemFolderFold_);

			const emitter = bc.bladeRack.emitter;
			emitter.on('folderfold', this.onSubitemFolderFold_);
			emitter.on('layout', this.onSubitemLayout_);
			emitter.on('inputchange', this.onSubitemInputChange_);
			emitter.on('monitorupdate', this.onSubitemMonitorUpdate_);
		}
	}

	private onListRemove_(ev: NestedOrderedSetEvents<BladeController>['remove']) {
		const isRoot = ev.target === ev.root;
		this.emitter.emit('remove', {
			isRoot: isRoot,
			sender: this,
		});

		if (!isRoot) {
			return;
		}

		const bc = ev.item;
		if (bc instanceof InputBindingController) {
			bc.binding.emitter.off('change', this.onItemInputChange_);
		} else if (bc instanceof MonitorBindingController) {
			bc.binding.emitter.off('update', this.onItemMonitorUpdate_);
		} else if (bc instanceof FolderController) {
			bc.folder.emitter.off('change', this.onItemFolderFold_);

			const emitter = bc.bladeRack.emitter;
			emitter.off('folderfold', this.onSubitemFolderFold_);
			emitter.off('layout', this.onSubitemLayout_);
			emitter.off('inputchange', this.onSubitemInputChange_);
			emitter.off('monitorupdate', this.onSubitemMonitorUpdate_);
		}
	}

	private onItemLayout_(ev: BladeEvents['change']) {
		if (ev.propertyName === 'hidden' || ev.propertyName === 'positions') {
			this.emitter.emit('layout', {
				sender: this,
			});
		}
	}

	private onItemDispose_(_: BladeEvents['dispose']): void {
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
		/* istanbul ignore next */
		if (!ibc) {
			throw TpError.shouldNeverHappen();
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
		/* istanbul ignore next */
		if (!mbc) {
			throw TpError.shouldNeverHappen();
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
			this.emitter.emit('folderfold', {
				folderController: fc,
				sender: this,
			});
		}
	}

	private onSubitemLayout_(_: BladeRackEvents['layout']) {
		this.emitter.emit('layout', {
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

	private onSubitemFolderFold_(ev: BladeRackEvents['folderfold']) {
		this.emitter.emit('folderfold', {
			folderController: ev.folderController,
			sender: this,
		});
	}
}
