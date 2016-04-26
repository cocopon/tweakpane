const PropertyViewFactoryComplex = require('../factory/property_view_factory_complex');
const PropertyViewInterface      = require('../interface/property_view_interface');

class FolderViewInterface {
	constructor(view) {
		this.view_ = view;
	}

	add(target, propName, options) {
		const propView = PropertyViewFactoryComplex.create(target, propName, false, options);
		this.view_.addSubview(propView);
		return new PropertyViewInterface(propView);
	}

	monitor(target, propName, options) {
		const propView = PropertyViewFactoryComplex.create(target, propName, true, options);
		this.view_.addSubview(propView);
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
