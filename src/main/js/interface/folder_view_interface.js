const PropertyViewFactoryComplex = require('../factory/property_view_factory_complex');
const ButtonView                 = require('../view/button_view');
const SeparatorView              = require('../view/separator_view');
const ButtonViewInterface        = require('./button_view_interface');
const PropertyViewInterface      = require('./property_view_interface');

class FolderViewInterface {
	constructor(view) {
		this.view_ = view;
	}

	add(target, propName, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = false;

		const propView = PropertyViewFactoryComplex.create(
			target, propName, options
		);

		this.view_.addSubview(propView);
		return new PropertyViewInterface(propView);
	}

	monitor(target, propName, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = true;

		const propView = PropertyViewFactoryComplex.create(
			target, propName, options
		);

		this.view_.addSubview(propView);
		return new PropertyViewInterface(propView);
	}

	/**
	 * Opens a folder.
	 * @return {FolderViewInterface}
	 */
	open() {
		this.view_.setExpanded(true, false);
		return this;
	}

	/**
	 * Closes a folder.
	 * @return {FolderViewInterface}
	 */
	close() {
		this.view_.setExpanded(false, false);
		return this;
	}

	/**
	 * Adds a clickable button.
	 * @param {string} title A title
	 * @return {ButtonViewInterface}
	 */
	addButton(title) {
		const buttonView = new ButtonView(title);
		this.view_.addSubview(buttonView);
		return new ButtonViewInterface(buttonView);
	}

	/**
	 * Adds a separator.
	 */
	addSeparator() {
		const separatorView = new SeparatorView();
		this.view_.addSubview(separatorView);
	}
}

module.exports = FolderViewInterface;
