import CodecProvider from '../../codec/codec_provider';
import EventEmitter  from '../../misc/event_emitter';

class Property {
	constructor(builder) {
		this.ref_ = builder.getReference();
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
			this.ref_.setValue(decodedValue);
		}

		this.model_.setValue(decodedValue);

		return true;
	}

	applySourceValue() {
		this.setValue(this.ref_.getValue());
	}
}

module.exports = Property;
