import {Emitter} from '../../../common/model/emitter';
import {TpError} from '../../../common/tp-error';

export interface NestedOrderedSetEvents<T> {
	add: {
		index: number;
		item: T;
		root: NestedOrderedSet<T>;
		target: NestedOrderedSet<T>;
	};
	remove: {
		index: number;
		item: T;
		root: NestedOrderedSet<T>;
		target: NestedOrderedSet<T>;
	};
}

type Extractor<T> = (item: T) => NestedOrderedSet<T> | null;

export class NestedOrderedSet<T> {
	public readonly emitter: Emitter<NestedOrderedSetEvents<T>> = new Emitter();
	private readonly items_: T[] = [];
	private readonly cache_: Set<T> = new Set();
	private readonly extract_: Extractor<T>;

	constructor(extract: Extractor<T>) {
		this.onSubListAdd_ = this.onSubListAdd_.bind(this);
		this.onSubListRemove_ = this.onSubListRemove_.bind(this);

		this.extract_ = extract;
	}

	get items(): T[] {
		return this.items_;
	}

	public allItems(): T[] {
		return Array.from(this.cache_);
	}

	public find(callback: (item: T) => boolean): T | null {
		for (const item of this.allItems()) {
			if (callback(item)) {
				return item;
			}
		}
		return null;
	}

	public includes(item: T): boolean {
		return this.cache_.has(item);
	}

	public add(item: T, opt_index?: number): void {
		if (this.includes(item)) {
			throw TpError.shouldNeverHappen();
		}

		const index = opt_index !== undefined ? opt_index : this.items_.length;
		this.items_.splice(index, 0, item);
		this.cache_.add(item);

		const subList = this.extract_(item);
		if (subList) {
			subList.emitter.on('add', this.onSubListAdd_);
			subList.emitter.on('remove', this.onSubListRemove_);

			subList.allItems().forEach((item) => {
				this.cache_.add(item);
			});
		}

		this.emitter.emit('add', {
			index: index,
			item: item,
			root: this,
			target: this,
		});
	}

	public remove(item: T): void {
		const index = this.items_.indexOf(item);
		if (index < 0) {
			return;
		}

		this.items_.splice(index, 1);
		this.cache_.delete(item);

		const subList = this.extract_(item);
		if (subList) {
			subList.emitter.off('add', this.onSubListAdd_);
			subList.emitter.off('remove', this.onSubListRemove_);
		}

		this.emitter.emit('remove', {
			index: index,
			item: item,
			root: this,
			target: this,
		});
	}

	private onSubListAdd_(ev: NestedOrderedSetEvents<T>['add']) {
		this.cache_.add(ev.item);
		this.emitter.emit('add', {
			index: ev.index,
			item: ev.item,
			root: this,
			target: ev.target,
		});
	}

	private onSubListRemove_(ev: NestedOrderedSetEvents<T>['remove']) {
		this.cache_.delete(ev.item);
		this.emitter.emit('remove', {
			index: ev.index,
			item: ev.item,
			root: this,
			target: ev.target,
		});
	}
}
