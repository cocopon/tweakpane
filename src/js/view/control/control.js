const EventEmitter = require('../../misc/event_emitter');
const Model        = require('../../model/model');
const View         = require('../view');

class Control extends View {
	constructor(model) {
		super();

		this.emitter_ = new EventEmitter();

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

	applyModel_() {
	}

	onModelChange_() {
		this.applyModel_();
	}
}

Control.EVENT_CHANGE = 'change';

module.exports = Control;
