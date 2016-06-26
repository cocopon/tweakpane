const BooleanPropertyViewFactory = require('../factory/boolean_property_view_factory');
const ColorPropertyViewFactory   = require('../factory/color_property_view_factory');
const NumberPropertyViewFactory  = require('../factory/number_property_view_factory');
const PropertyViewFactoryComplex = require('../factory/property_view_factory_complex');
const StringPropertyViewFactory  = require('../factory/string_property_view_factory');
const ButtonViewInterface        = require('../interface/button_view_interface');
const FolderViewInterface        = require('../interface/folder_view_interface');
const PropertyViewInterface      = require('../interface/property_view_interface');
const Errors                     = require('../misc/errors');
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

	static addText(view, ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = false;

		const type = typeof ref.getValue();
		const factory = (type === 'number') ? NumberPropertyViewFactory :
			(type === 'string') ? StringPropertyViewFactory :
			null;
		if (factory === null) {
			throw Errors.propertyTypeNotSupported(
				ref.getPropertyName()
			);
		}
		const propView = factory.createText(
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

	static addSelector(view, ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = false;

		const type = typeof ref.getValue();
		const factory = (type === 'number') ? NumberPropertyViewFactory :
			(type === 'string') ? StringPropertyViewFactory :
			(type === 'boolean') ? BooleanPropertyViewFactory :
			null;
		if (factory === null) {
			throw Errors.propertyTypeNotSupported(
				ref.getPropertyName()
			);
		}
		const propView = factory.createSelector(
			ref, options
		);

		view.addSubview(propView);
		return new PropertyViewInterface(propView);
	}

	static addCheckbox(view, ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = false;

		const propView = BooleanPropertyViewFactory.createCheckbox(
			ref, options
		);

		view.addSubview(propView);
		return new PropertyViewInterface(propView);
	}

	static addPalette(view, ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = false;

		const propView = ColorPropertyViewFactory.createPalette(
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

	static addGraph(view, ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = true;

		const propView = NumberPropertyViewFactory.createGraph(
			ref, options
		);

		view.addSubview(propView);
		return new PropertyViewInterface(propView);
	}

	static addLogger(view, ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = true;

		const propView = StringPropertyViewFactory.createLogger(
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
