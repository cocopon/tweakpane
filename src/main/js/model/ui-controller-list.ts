import {UiController} from '../controller/ui';
import {Emitter} from '../misc/emitter';
import {List} from './list';

type EventName = 'add' | 'remove';

/**
 * @hidden
 */
export class UiControllerList {
	public readonly emitter: Emitter<EventName>;
	private ucList_: List<UiController>;

	constructor() {
		this.onListAdd_ = this.onListAdd_.bind(this);
		this.onListRemove_ = this.onListRemove_.bind(this);
		this.onListItemDispose_ = this.onListItemDispose_.bind(this);

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
}
