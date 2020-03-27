import {FolderController} from '../controller/folder';
import {InputBindingController} from '../controller/input-binding';
import {MonitorBindingController} from '../controller/monitor-binding';
import {UiController, UiInputBinding, UiMonitorBinding} from '../controller/ui';
import {Emitter} from '../misc/emitter';
import {List} from './list';

type EventName = 'add' | 'fold' | 'inputchange' | 'monitorupdate' | 'remove';

/**
 * @hidden
 */
export class UiControllerList {
	public readonly emitter: Emitter<EventName>;
	private ucList_: List<UiController>;

	constructor() {
		this.onFolderFold_ = this.onFolderFold_.bind(this);
		this.onFolderInputChange_ = this.onFolderInputChange_.bind(this);
		this.onFolderMonitorUpdate_ = this.onFolderMonitorUpdate_.bind(this);
		this.onInputChange_ = this.onInputChange_.bind(this);
		this.onListAdd_ = this.onListAdd_.bind(this);
		this.onListItemDispose_ = this.onListItemDispose_.bind(this);
		this.onListRemove_ = this.onListRemove_.bind(this);
		this.onMonitorUpdate_ = this.onMonitorUpdate_.bind(this);

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

	private onListAdd_(_: List<UiController>, uc: UiController, index: number) {
		this.emitter.emit('add', [this, uc, index]);
		uc.disposable.emitter.on('dispose', this.onListItemDispose_);

		if (uc instanceof InputBindingController) {
			const emitter = uc.binding.emitter;
			emitter.on('change', this.onInputChange_);
		} else if (uc instanceof MonitorBindingController) {
			const emitter = uc.binding.value.emitter;
			emitter.on('update', this.onMonitorUpdate_);
		} else if (uc instanceof FolderController) {
			const emitter = uc.uiControllerList.emitter;
			emitter.on('fold', this.onFolderFold_);
			emitter.on('inputchange', this.onFolderInputChange_);
			emitter.on('monitorupdate', this.onFolderMonitorUpdate_);
		}
	}

	private onListRemove_(_: List<UiController>) {
		this.emitter.emit('remove', [this]);
	}

	private onListItemDispose_(_: UiController): void {
		const disposedUcs = this.ucList_.items.filter((uc) => {
			return uc.disposable.disposed;
		});
		disposedUcs.forEach((uc) => {
			this.ucList_.remove(uc);
		});
	}

	private onInputChange_(inputBinding: UiInputBinding, value: unknown): void {
		this.emitter.emit('inputchange', [this, inputBinding, value]);
	}

	private onMonitorUpdate_(
		monitorBinding: UiMonitorBinding,
		value: unknown,
	): void {
		this.emitter.emit('monitorupdate', [this, monitorBinding, value]);
	}

	private onFolderInputChange_(
		_: UiControllerList,
		inputBinding: UiInputBinding,
		value: unknown,
	) {
		this.emitter.emit('inputchange', [this, inputBinding, value]);
	}

	private onFolderMonitorUpdate_(
		_: UiControllerList,
		monitorBinding: UiMonitorBinding,
		value: unknown,
	) {
		this.emitter.emit('monitorupdate', [this, monitorBinding, value]);
	}

	private onFolderFold_() {
		this.emitter.emit('fold', [this]);
	}
}
