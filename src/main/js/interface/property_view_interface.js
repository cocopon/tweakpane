class PropertyViewInterface {
	constructor(view) {
		this.view_ = view;
	}

	on(eventName, handler, opt_scope) {
		const model = this.view_.getProperty().getModel();
		model.getEmitter().on(eventName, handler, opt_scope);
		return this;
	}

	off(eventName, handler, opt_scope) {
		const model = this.view_.getProperty().getModel();
		model.getEmitter().off(eventName, handler, opt_scope);
		return this;
	}
}

module.exports = PropertyViewInterface;
