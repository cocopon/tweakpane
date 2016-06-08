const CodecProvider = require('../codec/codec_provider');
const EventEmitter  = require('../misc/event_emitter');
const Model         = require('../model/model');

class Property {
	constructor(builder) {
		this.target_ = builder.getTarget();
		this.propName_ = builder.getPropertyName();
		this.label_ = builder.getLabel();
		this.id_ = builder.getId();
		this.forMonitor_ = builder.isForMonitor();

		this.model_ = builder.getModel();
		this.codec_ = CodecProvider.provide(this.model_);

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

	getCodec() {
		return this.codec_;
	}

	getValue() {
		return this.codec_.encode(
			this.model_.getValue()
		);
	}

	isForMonitor() {
		return this.forMonitor_;
	}

	setValue(value, opt_updatesSource) {
		if (!this.codec_.canDecode(value)) {
			return false;
		}

		const decodedValue = this.codec_.decode(value);

		const updatesSource = (opt_updatesSource !== undefined) ?
			opt_updatesSource :
			false;
		if (updatesSource) {
			this.target_[this.propName_] = decodedValue;
		}

		this.model_.setValue(decodedValue);

		return true;
	}

	applySourceValue() {
		this.setValue(this.target_[this.propName_]);
	}
}

Property.EVENT_MODEL_CHANGE = 'modelchange';

module.exports = Property;
