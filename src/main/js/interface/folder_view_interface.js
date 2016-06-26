const Reference     = require('../misc/reference');
const ViewInterface = require('./view_interface');

class FolderViewInterface extends ViewInterface {
	getComponentUtil_() {
		// Run-time requiring to avoid circular reference
		return require('../misc/component_util');
	}

	add(target, propertyName, opt_options) {
		return this.getComponentUtil_().addProperty(
			this.view_,
			new Reference(target, propertyName),
			opt_options
		);
	}

	monitor(target, propertyName, opt_options) {
		return this.getComponentUtil_().addMonitor(
			this.view_,
			new Reference(target, propertyName),
			opt_options
		);
	}

	addButton(title) {
		return this.getComponentUtil_().addButton(
			this.view_,
			title
		);
	}

	addSeparator() {
		return this.getComponentUtil_().addSeparator(
			this.view_
		);
	}

	/**
	 * Opens a folder.
	 * @return {FolderViewInterface}
	 */
	open() {
		const folder = this.view_.getFolder();
		folder.setExpanded(true);
		return this;
	}

	/**
	 * Closes a folder.
	 * @return {FolderViewInterface}
	 */
	close() {
		const folder = this.view_.getFolder();
		folder.setExpanded(false);
		return this;
	}
}

module.exports = FolderViewInterface;
