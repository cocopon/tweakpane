const NumberPropertyViewFactory  = require('../factory/number_property_view_factory');
const PropertyViewFactoryComplex = require('../factory/property_view_factory_complex');
const ButtonViewInterface        = require('../interface/button_view_interface');
const FolderViewInterface        = require('../interface/folder_view_interface');
const PropertyViewInterface      = require('../interface/property_view_interface');
const ButtonView                 = require('../view/button_view');
const FolderView                 = require('../view/folder_view');
const SeparatorView              = require('../view/separator_view');

class ComponentUtil {
	static addProperty(view, ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = false;

		const propView = PropertyViewFactoryComplex.create(
			ref, options
		);

		view.addSubview(propView);
		return new PropertyViewInterface(propView);
	}

	static addMonitor(view, ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = true;

		const propView = PropertyViewFactoryComplex.create(
			ref, options
		);

		view.addSubview(propView);
		return new PropertyViewInterface(propView);
	}

	static addSlider(view, ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = false;

		const propView = NumberPropertyViewFactory.createSlider(
			ref, options
		);

		view.addSubview(propView);
		return new PropertyViewInterface(propView);
	}

	/**
	 * Adds a folder.
	 * @param {string} title A title
	 * @return {FolderViewInterface}
	*/
	static addFolder(view, title) {
		const folderView = new FolderView(title);
		view.addSubview(folderView);
		return new FolderViewInterface(folderView);
	}

	/**
	 * Adds a clickable button.
	 * @param {string} title A title
	 * @return {ButtonViewInterface}
	 */
	static addButton(view, title) {
		const buttonView = new ButtonView(title);
		view.addSubview(buttonView);
		return new ButtonViewInterface(buttonView);
	}

	/**
	 * Adds a separator.
	 */
	static addSeparator(view) {
		const separatorView = new SeparatorView();
		view.addSubview(separatorView);
	}
}

module.exports = ComponentUtil;
