const BooleanPropertyViewFactory = require('../factory/boolean_property_view_factory');
const ColorPropertyViewFactory   = require('../factory/color_property_view_factory');
const NumberPropertyViewFactory  = require('../factory/number_property_view_factory');
const StringPropertyViewFactory  = require('../factory/string_property_view_factory');
const ButtonViewInterface        = require('../interface/button_view_interface');
const FolderViewInterface        = require('../interface/folder_view_interface');
const PropertyViewInterface      = require('../interface/property_view_interface');
const ViewInterface              = require('../interface/view_interface');
const Errors                     = require('../misc/errors');
const ButtonView                 = require('../view/button_view');
const FolderView                 = require('../view/folder_view');
const SeparatorView              = require('../view/separator_view');

class ComponentUtil {
	static findControlFactoryFunction_(ref) {
		const type = typeof ref.getValue();

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

	static createControl(ref, opt_options) {
		const factoryFn = this.findControlFactoryFunction_(ref);
		if (factoryFn === null) {
			throw Errors.propertyTypeNotSupported(
				ref.getPropertyName()
			);
		}
		const propView = factoryFn(
			ref, opt_options
		);
		return new PropertyViewInterface(propView);
	}

	static createText(ref, opt_options) {
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
		return new PropertyViewInterface(propView);
	}

	static createSlider(ref, opt_options) {
		const propView = NumberPropertyViewFactory.createSlider(
			ref, opt_options
		);
		return new PropertyViewInterface(propView);
	}

	static createSelector(ref, opt_options) {
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
		return new PropertyViewInterface(propView);
	}

	static createCheckbox(ref, opt_options) {
		const propView = BooleanPropertyViewFactory.createCheckbox(
			ref, opt_options
		);
		return new PropertyViewInterface(propView);
	}

	static createPalette(ref, opt_options) {
		const propView = ColorPropertyViewFactory.createPalette(
			ref, opt_options
		);
		return new PropertyViewInterface(propView);
	}

	static findMonitorFactoryFunction_(ref) {
		const type = typeof ref.getValue();

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

	static createMonitor(ref, opt_options) {
		const factoryFn = this.findMonitorFactoryFunction_(ref);
		if (factoryFn === null) {
			throw Errors.propertyTypeNotSupported(
				ref.getPropertyName()
			);
		}
		const propView = factoryFn(
			ref, opt_options
		);
		return new PropertyViewInterface(propView);
	}

	static createColorMonitor(ref, opt_options) {
		const propView = ColorPropertyViewFactory.createMonitor(
			ref, opt_options
		);
		return new PropertyViewInterface(propView);
	}

	static createGraph(ref, opt_options) {
		const propView = NumberPropertyViewFactory.createGraph(
			ref, opt_options
		);
		return new PropertyViewInterface(propView);
	}

	static createLogger(ref, opt_options) {
		const propView = StringPropertyViewFactory.createLogger(
			ref, opt_options
		);
		return new PropertyViewInterface(propView);
	}

	static createFolder(title) {
		const folderView = new FolderView(title);
		return new FolderViewInterface(folderView);
	}

	static createButton(title) {
		const buttonView = new ButtonView(title);
		return new ButtonViewInterface(buttonView);
	}

	static createSeparator() {
		const separatorView = new SeparatorView();
		return new ViewInterface(separatorView);
	}
}

module.exports = ComponentUtil;
