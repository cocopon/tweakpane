const EventEmitter = require('../misc/event_emitter');

class Constraint {
	constructor() {
		this.emitter_ = new EventEmitter();
	}

	getEmitter() {
		return this.emitter_;
	}

	format(value) {
		return value;
	}
}

Constraint.EVENT_CHANGE = 'change';

module.exports = Constraint;
