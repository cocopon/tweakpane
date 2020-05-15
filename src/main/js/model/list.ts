import {Emitter} from '../misc/emitter';

type EventType = 'append' | 'remove';

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

	public append(item: T): void {
		this.items_.push(item);
		this.emitter.emit('append', [item]);
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
