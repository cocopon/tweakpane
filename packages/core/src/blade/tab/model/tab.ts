import {Value, ValueEvents} from '../../../common/model/value';
import {createValue} from '../../../common/model/values';

const INDEX_NOT_SELECTED = -1;

export class Tab {
	public readonly empty: Value<boolean>;
	public readonly selectedIndex: Value<number>;
	private readonly items_: Value<boolean>[];

	constructor() {
		this.onItemSelectedChange_ = this.onItemSelectedChange_.bind(this);

		this.empty = createValue<boolean>(true);
		this.selectedIndex = createValue(INDEX_NOT_SELECTED);
		this.items_ = [];
	}

	public add(item: Value<boolean>, opt_index?: number): void {
		const index = opt_index ?? this.items_.length;
		this.items_.splice(index, 0, item);

		item.emitter.on('change', this.onItemSelectedChange_);
		this.keepSelection_();
	}

	public remove(item: Value<boolean>): void {
		const index = this.items_.indexOf(item);
		if (index < 0) {
			return;
		}

		this.items_.splice(index, 1);

		item.emitter.off('change', this.onItemSelectedChange_);
		this.keepSelection_();
	}

	private keepSelection_(): void {
		if (this.items_.length === 0) {
			this.selectedIndex.rawValue = INDEX_NOT_SELECTED;
			this.empty.rawValue = true;
			return;
		}

		const firstSelIndex = this.items_.findIndex((s) => s.rawValue);
		if (firstSelIndex < 0) {
			this.items_.forEach((s, i) => {
				s.rawValue = i === 0;
			});
			this.selectedIndex.rawValue = 0;
		} else {
			this.items_.forEach((s, i) => {
				s.rawValue = i === firstSelIndex;
			});
			this.selectedIndex.rawValue = firstSelIndex;
		}
		this.empty.rawValue = false;
	}

	private onItemSelectedChange_(ev: ValueEvents<boolean>['change']): void {
		if (ev.rawValue) {
			const index = this.items_.findIndex((s) => s === ev.sender);
			this.items_.forEach((s, i) => {
				s.rawValue = i === index;
			});
			this.selectedIndex.rawValue = index;
		} else {
			this.keepSelection_();
		}
	}
}
