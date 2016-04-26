const ConverterProvider = require('../converter/converter_provider');
const Errors            = require('../misc/errors');
const PropertyBuilder   = require('../misc/property_builder');
const Control           = require('../view/control/control');
const PropertyView      = require('../view/property_view');

class PropertyViewFactory {
	static supports(value) {
		throw Errors.notImplemented('supports');
	}

	static create(target, propName, monitor, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		const model = this.createModel_(monitor, options);
		const prop = this.createProperty_(target, propName, model, options);
		prop.applySourceValue();

		const propView = new PropertyView(prop);

		if (monitor) {
			const MonitorClass = this.getMonitorClass_(options);
			const monitor = new MonitorClass(model);
			propView.addSubview(monitor);
		}
		else {
			const ControlClass = this.getControlClass_(options);
			const control = new ControlClass(model);
			// TODO: Refactor
			const converter = ConverterProvider.provide(model);
			control.getEmitter().on(
				Control.EVENT_CHANGE,
				(stringValue) => {
					if (!converter.canConvert(stringValue)) {
						return;
					}
					model.setValue(converter.convert(stringValue));
				}
			);
			propView.addSubview(control);
		}

		return propView;
	}

	static createProperty_(target, propName, model, options) {
		const builder = new PropertyBuilder(target, propName, model);
		if (options.id !== undefined) {
			builder.setId(options.id);
		}
		if (options.label !== undefined) {
			builder.setLabel(options.label);
		}
		return builder.build();
	}

	static getControlClass_(options) {
		throw Errors.notImplemented('getControlClass_');
	}

	static getMonitorClass_(options) {
		throw Errors.notImplemented('getMonitorClass_');
	}

	static instanciateModel_(monitor, options) {
		throw Errors.notImplemented('instanciateModel_');
	}

	static createModel_(monitor, options) {
		const model = this.instanciateModel_(monitor, options);

		Object.keys(this.CONSTRAINT_FACTORIES).forEach((key) => {
			const value = options[key];
			if (value === undefined) {
				return;
			}

			const constraint = this.CONSTRAINT_FACTORIES[key](value);
			model.addConstraint(constraint);
		});

		return model;
	}
}

module.exports = PropertyViewFactory
