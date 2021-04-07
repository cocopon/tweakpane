import {InputBinding, InputBindingEvents} from '../../../common/binding/input';
import {
	MonitorBinding,
	MonitorBindingEvents,
} from '../../../common/binding/monitor';
import {Emitter} from '../../../common/model/emitter';
import {ViewPropsEvents} from '../../../common/model/view-props';
import {TpError} from '../../../common/tp-error';
import {View} from '../../../common/view/view';
import {Class, forceCast} from '../../../misc/type-util';
import {FolderController} from '../../folder/controller/folder';
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
		bladeController: BladeController<View>;
		index: number;
		isRoot: boolean;
		sender: BladeRack;
	};
	remove: {
		bladeController: BladeController<View>;
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
	private bcSet_: NestedOrderedSet<BladeController<View>>;

	constructor() {
		this.onSetAdd_ = this.onSetAdd_.bind(this);
		this.onSetRemove_ = this.onSetRemove_.bind(this);

		this.onChildDispose_ = this.onChildDispose_.bind(this);
		this.onChildLayout_ = this.onChildLayout_.bind(this);
		this.onChildFolderFold_ = this.onChildFolderFold_.bind(this);
		this.onChildInputChange_ = this.onChildInputChange_.bind(this);
		this.onChildMonitorUpdate_ = this.onChildMonitorUpdate_.bind(this);
		this.onChildViewPropsChange_ = this.onChildViewPropsChange_.bind(this);

		this.onDescendantLayout_ = this.onDescendantLayout_.bind(this);
		this.onDescendantFolderFold_ = this.onDescendantFolderFold_.bind(this);
		this.onDescendantInputChange_ = this.onDescendantInputChange_.bind(this);
		this.onDescendaantMonitorUpdate_ = this.onDescendaantMonitorUpdate_.bind(
			this,
		);

		this.bcSet_ = new NestedOrderedSet((bc) =>
			bc instanceof FolderController ? bc.bladeRack.bcSet_ : null,
		);
		this.emitter = new Emitter();

		this.bcSet_.emitter.on('add', this.onSetAdd_);
		this.bcSet_.emitter.on('remove', this.onSetRemove_);
	}

	get children(): BladeController<View>[] {
		return this.bcSet_.items;
	}

	public add(bc: BladeController<View>, opt_index?: number): void {
		if (bc.parent) {
			bc.parent.remove(bc);
		}
		bc['parent_'] = this;
		this.bcSet_.add(bc, opt_index);
	}

	public remove(bc: BladeController<View>): void {
		bc['parent_'] = null;
		this.bcSet_.remove(bc);
	}

	public find<B extends BladeController<View>>(controllerClass: Class<B>): B[] {
		return forceCast(
			this.bcSet_.allItems().filter((bc) => {
				return bc instanceof controllerClass;
			}),
		);
	}

	private onSetAdd_(ev: NestedOrderedSetEvents<BladeController<View>>['add']) {
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
		bc.blade.emitter.on('dispose', this.onChildDispose_);
		bc.viewProps.emitter.on('change', this.onChildViewPropsChange_);
		bc.blade.emitter.on('change', this.onChildLayout_);

		if (bc instanceof InputBindingController) {
			bc.binding.emitter.on('change', this.onChildInputChange_);
		} else if (bc instanceof MonitorBindingController) {
			bc.binding.emitter.on('update', this.onChildMonitorUpdate_);
		} else if (bc instanceof FolderController) {
			bc.folder.emitter.on('change', this.onChildFolderFold_);

			const emitter = bc.bladeRack.emitter;
			emitter.on('folderfold', this.onDescendantFolderFold_);
			emitter.on('layout', this.onDescendantLayout_);
			emitter.on('inputchange', this.onDescendantInputChange_);
			emitter.on('monitorupdate', this.onDescendaantMonitorUpdate_);
		}
	}

	private onSetRemove_(
		ev: NestedOrderedSetEvents<BladeController<View>>['remove'],
	) {
		const isRoot = ev.target === ev.root;
		this.emitter.emit('remove', {
			bladeController: ev.item,
			isRoot: isRoot,
			sender: this,
		});

		if (!isRoot) {
			return;
		}

		const bc = ev.item;
		if (bc instanceof InputBindingController) {
			bc.binding.emitter.off('change', this.onChildInputChange_);
		} else if (bc instanceof MonitorBindingController) {
			bc.binding.emitter.off('update', this.onChildMonitorUpdate_);
		} else if (bc instanceof FolderController) {
			bc.folder.emitter.off('change', this.onChildFolderFold_);

			const emitter = bc.bladeRack.emitter;
			emitter.off('folderfold', this.onDescendantFolderFold_);
			emitter.off('layout', this.onDescendantLayout_);
			emitter.off('inputchange', this.onDescendantInputChange_);
			emitter.off('monitorupdate', this.onDescendaantMonitorUpdate_);
		}
	}

	private onChildLayout_(ev: BladeEvents['change']) {
		if (ev.propertyName === 'positions') {
			this.emitter.emit('layout', {
				sender: this,
			});
		}
	}

	private onChildViewPropsChange_(_ev: ViewPropsEvents['change']) {
		this.emitter.emit('layout', {
			sender: this,
		});
	}

	private onChildDispose_(_: BladeEvents['dispose']): void {
		const disposedUcs = this.bcSet_.items.filter((bc) => {
			return bc.blade.disposed;
		});
		disposedUcs.forEach((bc) => {
			this.bcSet_.remove(bc);
		});
	}

	private onChildInputChange_(ev: InputBindingEvents<unknown>['change']): void {
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

	private onChildMonitorUpdate_(
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

	private onChildFolderFold_(ev: FolderEvents['change']) {
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

	private onDescendantLayout_(_: BladeRackEvents['layout']) {
		this.emitter.emit('layout', {
			sender: this,
		});
	}

	private onDescendantInputChange_(ev: BladeRackEvents['inputchange']) {
		this.emitter.emit('inputchange', {
			bindingController: ev.bindingController,
			sender: this,
		});
	}

	private onDescendaantMonitorUpdate_(ev: BladeRackEvents['monitorupdate']) {
		this.emitter.emit('monitorupdate', {
			bindingController: ev.bindingController,
			sender: this,
		});
	}

	private onDescendantFolderFold_(ev: BladeRackEvents['folderfold']) {
		this.emitter.emit('folderfold', {
			folderController: ev.folderController,
			sender: this,
		});
	}
}
