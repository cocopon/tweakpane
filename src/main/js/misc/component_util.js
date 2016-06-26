const ColorCodec                 = require('../codec/color_codec');
const BooleanPropertyViewFactory = require('../factory/boolean_property_view_factory');
const ColorPropertyViewFactory   = require('../factory/color_property_view_factory');
const NumberPropertyViewFactory  = require('../factory/number_property_view_factory');
const StringPropertyViewFactory  = require('../factory/string_property_view_factory');
const ButtonViewInterface        = require('../interface/button_view_interface');
const FolderViewInterface        = require('../interface/folder_view_interface');
const PropertyViewInterface      = require('../interface/property_view_interface');
const Errors                     = require('../misc/errors');
const ButtonView                 = require('../view/button_view');
const FolderView                 = require('../view/folder_view');
const SeparatorView              = require('../view/separator_view');

class ComponentUtil {
	static findControlFactoryFunction_(ref) {
		const type = typeof ref.getValue();

		if (type === 'string' && ColorCodec.canDecode(ref.getValue())) {
			return ColorPropertyViewFactory.createPalette;
		}
		if (type === 'boolean') {
			return BooleanPropertyViewFactory.createCheckbox;
		}
		if (type === 'number') {
			return NumberPropertyViewFactory.createText;
		}
		if (type === 'string') {
			return StringPropertyViewFactory.createText;
		}
		return null;
	}

	static addControl(view, ref, opt_options) {
		const factoryFn = this.findControlFactoryFunction_(ref);
		if (factoryFn === null) {
			throw Errors.propertyTypeNotSupported(
				ref.getPropertyName()
			);
		}

		const propView = factoryFn(
			ref, opt_options
		);
		view.addSubview(propView);
		return new PropertyViewInterface(propView);
	}

	static addText(view, ref, opt_options) {
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
			ref, opt_options
		);
		view.addSubview(propView);
		return new PropertyViewInterface(propView);
	}

	static addSlider(view, ref, opt_options) {
		const propView = NumberPropertyViewFactory.createSlider(
			ref, opt_options
		);
		view.addSubview(propView);
		return new PropertyViewInterface(propView);
	}

	static addSelector(view, ref, opt_options) {
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
			ref, opt_options
		);
		view.addSubview(propView);
		return new PropertyViewInterface(propView);
	}

	static addCheckbox(view, ref, opt_options) {
		const propView = BooleanPropertyViewFactory.createCheckbox(
			ref, opt_options
		);
		view.addSubview(propView);
		return new PropertyViewInterface(propView);
	}

	static addPalette(view, ref, opt_options) {
		const propView = ColorPropertyViewFactory.createPalette(
			ref, opt_options
		);
		view.addSubview(propView);
		return new PropertyViewInterface(propView);
	}

	static findMonitorFactoryFunction_(ref) {
		const type = typeof ref.getValue();

		if (type === 'string' && ColorCodec.canDecode(ref.getValue())) {
			return ColorPropertyViewFactory.createMonitor;
		}
		if (type === 'boolean') {
			return BooleanPropertyViewFactory.createMonitor;
		}
		if (type === 'number') {
			return NumberPropertyViewFactory.createMonitor;
		}
		if (type === 'string') {
			return StringPropertyViewFactory.createMonitor;
		}
		return null;
	}

	static addMonitor(view, ref, opt_options) {
		const factoryFn = this.findMonitorFactoryFunction_(ref);
		if (factoryFn === null) {
			throw Errors.propertyTypeNotSupported(
				ref.getPropertyName()
			);
		}

		const propView = factoryFn(
			ref, opt_options
		);
		view.addSubview(propView);
		return new PropertyViewInterface(propView);
	}

	static addGraph(view, ref, opt_options) {
		const propView = NumberPropertyViewFactory.createGraph(
			ref, opt_options
		);
		view.addSubview(propView);
		return new PropertyViewInterface(propView);
	}

	static addLogger(view, ref, opt_options) {
		const propView = StringPropertyViewFactory.createLogger(
			ref, opt_options
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
