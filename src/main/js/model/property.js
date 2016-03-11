const EventEmitter = require('../misc/event_emitter');
const Model        = require('../model/model');

class Property {
	constructor(target, propName, model) {
		this.target_ = target;
		this.propName_ = propName;
		this.displayName_ = propName;
		this.id_ = propName;

		this.model_ = model;
		this.model_.getEmitter().on(
			Model.EVENT_CHANGE,
			this.onModelChange_,
			this
		);

		this.disabled_ = false;
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

	setId(id) {
		this.id_ = id;
		this.emitter_.notifyObservers(Property.EVENT_CHANGE);
	}

	getDisplayName() {
		return this.displayName_;
	}

	setDisplayName(displayName) {
		this.displayName_ = displayName;
		this.emitter_.notifyObservers(Property.EVENT_CHANGE);
	}

	getModel() {
		return this.model_;
	}

	isDisabled() {
		return this.disabled_;
	}

	setDisabled(disabled) {
		this.disabled_ = disabled;
		this.emitter_.notifyObservers(Property.EVENT_CHANGE);
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

Property.EVENT_CHANGE = 'change';
Property.EVENT_MODEL_CHANGE = 'modelchange';

module.exports = Property;
