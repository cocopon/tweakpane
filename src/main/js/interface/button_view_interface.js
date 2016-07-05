import ViewInterface from './view_interface';

class ButtonViewInterface extends ViewInterface {
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
