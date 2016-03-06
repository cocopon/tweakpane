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

	sync(opt_interval) {
		this.getController().startSync(opt_interval);
		return this;
	}
}

module.exports = PropertyFluent;
