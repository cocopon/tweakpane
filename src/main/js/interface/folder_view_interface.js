const Reference     = require('../misc/reference');
const ViewInterface = require('./view_interface');

class FolderViewInterface extends ViewInterface {
	getComponentUtil_() {
		// Run-time requiring to avoid cross reference
		return require('../misc/component_util');
	}

	addProperty_(propertyViewInterface) {
		this.view_.addSubview(
			propertyViewInterface.getView()
		);
		return propertyViewInterface;
	}

	// Controls

	addControl(target, propertyName, opt_options) {
		return this.addProperty_(
			this.getComponentUtil_().createControl(
				new Reference(target, propertyName),
				opt_options
			)
		);
	}

	addText(target, propertyName, opt_options) {
		return this.addProperty_(
			this.getComponentUtil_().createText(
				new Reference(target, propertyName),
				opt_options
			)
		);
	}

	addSlider(target, propertyName, opt_options) {
		return this.addProperty_(
			this.getComponentUtil_().createSlider(
				new Reference(target, propertyName),
				opt_options
			)
		);
	}

	addSelector(target, propertyName, opt_options) {
		return this.addProperty_(
			this.getComponentUtil_().createSelector(
				new Reference(target, propertyName),
				opt_options
			)
		);
	}

	addCheckbox(target, propertyName, opt_options) {
		return this.addProperty_(
			this.getComponentUtil_().createCheckbox(
				new Reference(target, propertyName),
				opt_options
			)
		);
	}

	addPalette(target, propertyName, opt_options) {
		return this.addProperty_(
			this.getComponentUtil_().createPalette(
				new Reference(target, propertyName),
				opt_options
			)
		);
	}

	// Monitors

	addMonitor(target, propertyName, opt_options) {
		return this.addProperty_(
			this.getComponentUtil_().createMonitor(
				new Reference(target, propertyName),
				opt_options
			)
		);
	}

	addColorMonitor(target, propertyName, opt_options) {
		return this.addProerty_(
			this.getComponentUtil_().createColorMonitor(
				new Reference(target, propertyName),
				opt_options
			)
		);
	}

	addLogger(target, propertyName, opt_options) {
		return this.addProperty_(
			this.getComponentUtil_().createLogger(
				new Reference(target, propertyName),
				opt_options
			)
		);
	}

	addGraph(target, propertyName, opt_options) {
		return this.addProperty_(
			this.getComponentUtil_().createGraph(
				new Reference(target, propertyName),
				opt_options
			)
		);
	}

	// Other Components

	addButton(title) {
		const intf = this.getComponentUtil_().createButton(title);
		const buttonView = intf.getView();
		this.view_.addSubview(buttonView);
		return intf;
	}

	addSeparator() {
		const intf = this.getComponentUtil_().createSeparator();
		const separatorView = intf.getView();
		this.view_.addSubview(separatorView);
		return intf;
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
