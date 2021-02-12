import {Emitter, EventTypeMap} from '../misc/emitter';

/**
 * @hidden
 */
export interface ListEvents<T> extends EventTypeMap {
	add: {
		index: number;
		item: T;
		sender: List<T>;
	};
	remove: {
		sender: List<T>;
	};
}

/**
 * @hidden
 */
export class List<T> {
	public readonly emitter: Emitter<ListEvents<T>>;
	private items_: T[];

	constructor() {
		this.emitter = new Emitter();
		this.items_ = [];
	}

	get items(): T[] {
		return this.items_;
	}

	public add(item: T, opt_index?: number): void {
		const index = opt_index !== undefined ? opt_index : this.items_.length;
		this.items_.splice(index, 0, item);
		this.emitter.emit('add', {
			index: index,
			item: item,
			sender: this,
		});
	}

	public remove(item: T): void {
		const index = this.items_.indexOf(item);
		if (index < 0) {
			return;
		}

		this.items_.splice(index, 1);
		this.emitter.emit('remove', {
			sender: this,
		});
	}
}
