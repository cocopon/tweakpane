const Reference     = require('../misc/reference');
const ViewInterface = require('./view_interface');

class FolderViewInterface extends ViewInterface {
	getComponentUtil_() {
		// Run-time requiring to avoid cross reference
		return require('../misc/component_util');
	}

	addText(target, propertyName, opt_options) {
		return this.getComponentUtil_().addText(
			this.view_,
			new Reference(target, propertyName),
			opt_options
		);
	}

	addSlider(target, propertyName, opt_options) {
		return this.getComponentUtil_().addSlider(
			this.view_,
			new Reference(target, propertyName),
			opt_options
		);
	}

	addSelector(target, propertyName, opt_options) {
		return this.getComponentUtil_().addSelector(
			this.view_,
			new Reference(target, propertyName),
			opt_options
		);
	}

	addCheckbox(target, propertyName, opt_options) {
		return this.getComponentUtil_().addCheckbox(
			this.view_,
			new Reference(target, propertyName),
			opt_options
		);
	}

	addPalette(target, propertyName, opt_options) {
		return this.getComponentUtil_().addPalette(
			this.view_,
			new Reference(target, propertyName),
			opt_options
		);
	}

	addMonitor(target, propertyName, opt_options) {
		return this.getComponentUtil_().addMonitor(
			this.view_,
			new Reference(target, propertyName),
			opt_options
		);
	}

	addLogger(target, propertyName, opt_options) {
		return this.getComponentUtil_().addLogger(
			this.view_,
			new Reference(target, propertyName),
			opt_options
		);
	}

	addGraph(target, propertyName, opt_options) {
		return this.getComponentUtil_().addGraph(
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
