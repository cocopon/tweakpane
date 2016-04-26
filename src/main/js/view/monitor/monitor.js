const Model = require('../../model/model');
const View  = require('../view');

class Monitor extends View {
	constructor(model) {
		super();

		model.getEmitter().on(
			Model.EVENT_CHANGE,
			this.onModelChange_,
			this
		);
		this.model_ = model;
	}

	getModel() {
		return this.model_;
	}

	applyModel_() {
	}

	onModelChange_() {
		this.applyModel_();
	}
}

Monitor.BLOCK_CLASS = 'm';

module.exports = Monitor;
