import Constraint from './constraint';

class ListConstraint extends Constraint {
	constructor(items) {
		super();

		this.items_ = items;
	}

	getItems() {
		return this.items_;
	}

	getIndexOfValue_(value) {
		let result = -1;
		this.items_.forEach((item, index) => {
			if (item.value === value) {
				result = index;
			}
		});
		return result;
	}

	constrain(value) {
		if (this.items_ === null ||
				this.items_.length === 0) {
			return value;
		}

		const index = this.getIndexOfValue_(value);
		const item = (index >= 0) ?
			this.items_[index] :
			this.items_[0];
		return item.value;
	}
}

export default ListConstraint;
