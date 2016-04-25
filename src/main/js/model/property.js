const EventEmitter = require('../misc/event_emitter');
const Model        = require('../model/model');

class Property {
	constructor(builder) {
		this.target_ = builder.getTarget();
		this.propName_ = builder.getPropertyName();
		this.label_ = builder.getLabel();
		this.id_ = builder.getId();

		this.model_ = builder.getModel();
		this.model_.getEmitter().on(
			Model.EVENT_CHANGE,
			this.onModelChange_,
			this
		);

		this.emitter_ = new EventEmitter();
	}

	getEmitter() {
		return this.emitter_;
	}

	getTarget() {
		return this.target_;
	}

	getPropertyName() {
		return this.propName_;
	}

	getId() {
		return this.id_;
	}

	getLabel() {
		return this.label_;
	}

	getModel() {
		return this.model_;
	}

	applySourceValue() {
		this.model_.setValue(this.target_[this.propName_]);
	}

	updateSourceValue() {
		this.target_[this.propName_] = this.model_.getValue();
	}

	onModelChange_() {
		this.emitter_.notifyObservers(
			Property.EVENT_MODEL_CHANGE,
			[this]
		);
	}
}

Property.EVENT_MODEL_CHANGE = 'modelchange';

module.exports = Property;
