const PropertyViewInterface = require('../interface/property_view_interface');
const PropertyViewProvider  = require('../misc/property_view_provider');

class FolderViewInterface {
	constructor(view) {
		this.view_ = view;
	}

	add(target, propName, options) {
		const propView = PropertyViewProvider.provide(target, propName, false, options);
		this.view_.addSubview(propView);
		return new PropertyViewInterface(propView);
	}

	monitor(target, propName, options) {
		const propView = PropertyViewProvider.provide(target, propName, true, options);
		this.view_.addSubview(propView);

		// TODO: Update monitoring property list
		return new PropertyViewInterface(propView);
	}

	/**
	 * Open a folder.
	 * @return {FolderViewInterface}
	 */
	open() {
		this.view_.setExpanded(true, false);
		return this;
	}

	/**
	 * Close a folder.
	 * @return {FolderViewInterface}
	 */
	close() {
		this.view_.setExpanded(false, false);
		return this;
	}
}

module.exports = FolderViewInterface;
