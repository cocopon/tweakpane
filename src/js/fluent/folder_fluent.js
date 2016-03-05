const PropertyControllerProvider = require('../misc/property_controller_provider');
const FluentProvider = require('../misc/fluent_provider');
const Fluent = require('./fluent');

class FolderFluent extends Fluent {
	add(target, propName) {
		const controller = PropertyControllerProvider.provide(target, propName);
		if (controller === null) {
			// TODO: Error
			return null;
		}

		this.getController().addSubcontroller(controller);

		return FluentProvider.provide(controller);
	}

	open() {
		this.view_.setExpanded(true, false);
	}

	close() {
		this.view_.setExpanded(false, false);
	}
}

module.exports = FolderFluent;
