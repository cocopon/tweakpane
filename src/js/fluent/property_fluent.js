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
}

module.exports = PropertyFluent;
