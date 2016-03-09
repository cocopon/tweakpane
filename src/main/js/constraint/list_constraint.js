const Constraint = require('./constraint');

class ListConstraint extends Constraint {
	constructor() {
		super();

		this.items_ = null;
	}

	getItems() {
		return this.items_;
	}

	setItems(items) {
		this.items_ = items;
		this.getEmitter().notifyObservers(Constraint.EVENT_CHANGE);
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

	format(value) {
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

module.exports = ListConstraint;
