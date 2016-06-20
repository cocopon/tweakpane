const EventEmitter = require('../misc/event_emitter');

class Model {
	constructor() {
		this.emitter_ = new EventEmitter();
	}

	getEmitter() {
		return this.emitter_;
	}
}

Model.EVENT_CHANGE = 'change';

module.exports = Model;
