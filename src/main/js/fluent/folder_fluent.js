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

	/**
	 * Open a folder.
	 * @return {FolderFluent}
	 */
	open() {
		const folderView = this.getController().getView();
		folderView.setExpanded(true, false);
		return this;
	}

	/**
	 * Close a folder.
	 * @return {FolderFluent}
	 */
	close() {
		const folderView = this.getController().getView();
		folderView.setExpanded(false, false);
		return this;
	}
}

module.exports = FolderFluent;
