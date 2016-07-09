import ViewInterface from './view_interface';

class PropertyViewInterface extends ViewInterface {
	on(eventName, handler, opt_scope) {
		const model = this.getView().getProperty().getModel();
		model.getEmitter().on(eventName, handler, opt_scope);
		return this;
	}

	off(eventName, handler, opt_scope) {
		const model = this.getView().getProperty().getModel();
		model.getEmitter().off(eventName, handler, opt_scope);
		return this;
	}
}

export default PropertyViewInterface;
