import Errors from '../../misc/errors';
import Model  from '../model';

class PropertyModel extends Model {
	constructor() {
		super();

		this.value_ = null;
		this.constraints_ = [];
	}

	getValue() {
		return this.value_;
	}

	static validate(value) {
		return value !== null;
	}

	constrain_() {
		this.value_ = this.constraints_.reduce((v, constraint) => {
			return constraint.constrain(v);
		}, this.value_);
	}

	setValue(value) {
		if (!this.constructor.validate(value)) {
			return false;
		}

		const prevValue = this.value_;
		this.value_ = value;
		this.constrain_();

		const changed = (prevValue !== this.value_);
		if (changed) {
			this.emitter_.notifyObservers(
				Model.EVENT_CHANGE,
				[this.value_]
			);
		}

		return changed;
	}

	getConstraints() {
		return this.constraints_;
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

		this.constraints_.push(constraint);

		const prevValue = this.value_;
		this.constrain_();

		if (prevValue !== this.value_) {
			this.emitter_.notifyObservers(
				Model.EVENT_CHANGE,
				[this.value_]
			);
		}
	}
}

module.exports = PropertyModel;
