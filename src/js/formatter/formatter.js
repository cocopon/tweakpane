const EventEmitter = require('../misc/event_emitter');

class Formatter {
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

Formatter.EVENT_CHANGE = 'change';

module.exports = Formatter;
