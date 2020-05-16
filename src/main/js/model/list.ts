import {Emitter} from '../misc/emitter';

type EventType = 'add' | 'remove';

/**
 * @hidden
 */
export class List<T> {
	public readonly emitter: Emitter<EventType>;
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
		this.emitter.emit('add', [item, index]);
	}

	public remove(item: T): void {
		const index = this.items_.indexOf(item);
		if (index < 0) {
			return;
		}

		this.items_.splice(index, 1);
		this.emitter.emit('remove');
	}
}
