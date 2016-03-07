const ClassName    = require('../../misc/class_name');
const EventEmitter = require('../../misc/event_emitter');
const Model        = require('../../model/model');
const View         = require('../view');

class Control extends View {
	constructor(model) {
		super();

		this.emitter_ = new EventEmitter();
		this.disabled_ = false;

		model.getEmitter().on(
			Model.EVENT_CHANGE,
			this.onModelChange_,
			this
		);

		this.model_ = model;
		this.applyModel_();
	}

	getModel() {
		return this.model_;
	}

	getEmitter() {
		return this.emitter_;
	}

	isDisabled() {
		return this.disabled_;
	}

	setDisabled(disabled) {
		this.disabled_ = disabled;
		this.applyDisabled_();
	}

	applyDisabled_() {
		const disabledClass = ClassName.get(this.constructor.BLOCK_CLASS, null, 'disabled');
		if (this.disabled_) {
			this.addClass(disabledClass);
		}
		else {
			this.removeClass(disabledClass);
		}
	}

	applyModel_() {
	}

	onModelChange_() {
		this.applyModel_();
	}
}

Control.BLOCK_CLASS = 'Control';
Control.EVENT_CHANGE = 'change';

module.exports = Control;
