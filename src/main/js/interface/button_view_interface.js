class ButtonViewInterface {
	constructor(view) {
		this.view_ = view;
	}

	on(eventName, handler, opt_scope) {
		const emitter = this.view_.getEmitter();
		emitter.on(eventName, handler, opt_scope);
		return this;
	}

	off(eventName, handler, opt_scope) {
		const emitter = this.view_.getEmitter();
		emitter.off(eventName, handler, opt_scope);
		return this;
	}
}

module.exports = ButtonViewInterface;
