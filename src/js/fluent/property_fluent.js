const Fluent = require('./fluent');

class PropertyFluent extends Fluent {
	id(id) {
		this.getController().setId(id);
		return this;
	}

	label(label) {
		this.getController().getView().setLabel(label);
		return this;
	}

	sync(opt_interval) {
		this.getController().startSync(opt_interval);
	}
}

module.exports = PropertyFluent;
