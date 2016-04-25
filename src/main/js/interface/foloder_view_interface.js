const PropertyViewProvider = require('../misc/property_view_provider');

class FolderViewInterface {
	constructor(view) {
		this.view_ = view;
	}

	add(target, propName, options) {
		const propView = PropertyViewProvider.provide(target, propName, options);
		this.view_.addSubview(propView);
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
