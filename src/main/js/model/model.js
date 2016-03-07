const Constraint    = require('../constraint/constraint');
const Errors        = require('../misc/errors');
const EventEmitter  = require('../misc/event_emitter');

class Model {
	constructor() {
		this.emitter_ = new EventEmitter();
		this.value_ = null;
		this.constraints_ = [];
	}

	getEmitter() {
		return this.emitter_;
	}

	getValue() {
		return this.value_;
	}

	format_() {
		this.value_ = this.constraints_.reduce((v, constraint) => {
			return constraint.format(v);
		}, this.value_);
		this.emitter_.notifyObservers(
			Model.EVENT_CHANGE,
			[this.value_]
		);
	}

	setValue(value) {
		if (!this.validate(value)) {
			return false;
		}

		this.value_ = value;
		this.format_();

		return true;
	}

	findConstraintByClass(ConstraintClass) {
		const result = this.constraints_.filter((constraint) => {
			return constraint instanceof ConstraintClass;
		});
		return (result.length > 0) ?
			result[0] :
			null;
	}

	addConstraint(constraint) {
		if (this.findConstraintByClass(constraint.constructor)) {
			throw Errors.constraintAlreadyExists(constraint);
		}

		constraint.getEmitter().on(
			Constraint.EVENT_CHANGE,
			this.onConstraintChange_,
			this
		);
		this.constraints_.push(constraint);

		this.format_();
	}

	onConstraintChange_() {
		this.format_();
	}
}

Model.EVENT_CHANGE = 'change';

module.exports = Model;
