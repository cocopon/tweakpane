import EventEmitter from '../../misc/event_emitter';
import Model        from '../../model/model';
import View         from '../view';

class Control extends View {
	constructor(property) {
		super();

		this.emitter_ = new EventEmitter();

		const model = property.getModel();
		model.getEmitter().on(
			Model.EVENT_CHANGE,
			this.onModelChange_,
			this
		);
		this.prop_ = property;
	}

	getProperty() {
		return this.prop_;
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

Control.BLOCK_CLASS = 'c';
Control.EVENT_CHANGE = 'change';

module.exports = Control;
