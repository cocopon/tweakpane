const Formatter    = require('../formatter/formatter');
const EventEmitter = require('../misc/event_emitter');

class Model {
	constructor() {
		this.emitter_ = new EventEmitter();
		this.value_ = null;
		this.formatters_ = [];
	}

	getEmitter() {
		return this.emitter_;
	}

	getValue() {
		return this.value_;
	}

	format_(value) {
		return this.formatters_.reduce((v, formatter) => {
			return formatter.format(v);
		}, value);
	}

	setValue(value) {
		if (!this.validate(value)) {
			return false;
		}

		this.value_ = this.format_(value);
		this.emitter_.notifyObservers(Model.EVENT_CHANGE);

		return true;
	}

	findFormatterByClass(FormatterClass) {
		const result = this.formatters_.filter((formatter) => {
			return formatter instanceof FormatterClass;
		});
		return (result.length > 0) ?
			result[0] :
			null;
	}

	addFormatter(formatter) {
		// TODO: Check duplication

		formatter.getEmitter().on(
			Formatter.EVENT_CHANGE,
			this.onFormatterChange_,
			this
		);

		this.formatters_.push(formatter);
	}

	onFormatterChange_() {
		this.emitter_.notifyObservers(Model.EVENT_CHANGE);
	}
}

Model.EVENT_CHANGE = 'change';

module.exports = Model;
