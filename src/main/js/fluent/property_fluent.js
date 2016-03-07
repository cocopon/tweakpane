const Fluent = require('./fluent');

class PropertyFluent extends Fluent {
	id(id) {
		const prop = this.getController().getView().getProperty();
		prop.setId(id);
		return this;
	}

	label(label) {
		const prop = this.getController().getView().getProperty();
		prop.setDisplayName(label);
		return this;
	}

	monitor(opt_interval) {
		this.getController().startMonitoring(opt_interval);
		return this;
	}

	on(eventName, handler, opt_scope) {
		const model = this.getController().getView().getProperty().getModel();
		model.getEmitter().on(
			eventName,
			handler,
			opt_scope
		);
	}
}

module.exports = PropertyFluent;
