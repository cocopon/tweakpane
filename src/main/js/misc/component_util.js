import BooleanPropertyViewFactory from '../factory/boolean_property_view_factory';
import ColorPropertyViewFactory   from '../factory/color_property_view_factory';
import NumberPropertyViewFactory  from '../factory/number_property_view_factory';
import StringPropertyViewFactory  from '../factory/string_property_view_factory';
import ButtonViewInterface        from '../interface/button_view_interface';
import FolderViewInterface        from '../interface/folder_view_interface';
import PropertyViewInterface      from '../interface/property_view_interface';
import ViewInterface              from '../interface/view_interface';
import Errors                     from '../misc/errors';
import ButtonView                 from '../view/button_view';
import FolderView                 from '../view/folder_view';
import SeparatorView              from '../view/separator_view';

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
