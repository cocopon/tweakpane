import {Class} from '../../../../misc/type-util';
import {InputBinding, InputBindingEvents} from '../../../common/binding/input';
import {
	MonitorBinding,
	MonitorBindingEvents,
} from '../../../common/binding/monitor';
import {Emitter} from '../../../common/model/emitter';
import {FolderEvents} from '../../../common/model/folder';
import {List, ListEvents} from '../../../common/model/list';
import {FolderController} from '../../folder/controller';
import {BladeController} from '../controller/blade';
import {InputBindingController} from '../controller/input-binding';
import {MonitorBindingController} from '../controller/monitor-binding';
import {BladeEvents} from './blade';

/**
 * @hidden
 */
export interface BladeRackEvents {
	add: {
		blade: BladeController;
		index: number;
		sender: BladeRack;
	};
	remove: {
		sender: BladeRack;
	};

	inputchange: {
		inputBinding: InputBinding<unknown>;
		sender: BladeRack;
		value: unknown;
	};
	itemfold: {
		expanded: boolean;
		sender: BladeRack;
	};
	itemlayout: {
		sender: BladeRack;
	};
	monitorupdate: {
		monitorBinding: MonitorBinding<unknown>;
		sender: BladeRack;
		value: unknown;
	};
}

/**
 * @hidden
 */
export class BladeRack {
	public readonly emitter: Emitter<BladeRackEvents>;
	private blades_: List<BladeController>;

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

		this.blades_ = new List();
		this.emitter = new Emitter();

		this.blades_.emitter.on('add', this.onListAdd_);
		this.blades_.emitter.on('remove', this.onListRemove_);
	}

	get items(): BladeController[] {
		return this.blades_.items;
	}

	public add(bc: BladeController, opt_index?: number): void {
		this.blades_.add(bc, opt_index);
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
			blade: bc,
			index: ev.index,
			sender: this,
		});
		bc.blade.emitter.on('dispose', this.onListItemDispose_);
		bc.blade.emitter.on('change', this.onListItemLayout_);

		if (bc instanceof InputBindingController) {
			const emitter = bc.binding.emitter;
			// TODO: Find more type-safe way
			(emitter.on as any)('change', this.onItemInputChange_);
		} else if (bc instanceof MonitorBindingController) {
			const emitter = bc.binding.emitter;
			// TODO: Find more type-safe way
			emitter.on('update', this.onItemMonitorUpdate_);
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
		const disposedUcs = this.blades_.items.filter((bc) => {
			return bc.blade.disposed;
		});
		disposedUcs.forEach((bc) => {
			this.blades_.remove(bc);
		});
	}

	private onItemInputChange_(ev: InputBindingEvents<unknown>['change']): void {
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

	private onSubitemLayout_(_: BladeRackEvents['itemlayout']) {
		this.emitter.emit('itemlayout', {
			sender: this,
		});
	}

	private onSubitemInputChange_(ev: BladeRackEvents['inputchange']) {
		this.emitter.emit('inputchange', {
			inputBinding: ev.inputBinding,
			sender: this,
			value: ev.value,
		});
	}

	private onSubitemMonitorUpdate_(ev: BladeRackEvents['monitorupdate']) {
		this.emitter.emit('monitorupdate', {
			monitorBinding: ev.monitorBinding,
			sender: this,
			value: ev.value,
		});
	}

	private onSubitemFolderFold_(ev: BladeRackEvents['itemfold']) {
		this.emitter.emit('itemfold', {
			expanded: ev.expanded,
			sender: this,
		});
	}
}
