const Errors          = require('../misc/errors');
const PropertyBuilder = require('../misc/property_builder');
const Control         = require('../view/control/control');
const PropertyView    = require('../view/property_view');

class PropertyViewFactory {
	static supports(value) {
		throw Errors.notImplemented('supports');
	}

	static create(target, propName, options) {
		const model = this.createModel_(options);
		this.addConstraints_(model, options);

		const prop = this.createProperty_(target, propName, model, options);
		prop.applySourceValue();

		const propView = new PropertyView(prop);

		if (options.forMonitor) {
			const monitor = this.createMonitor_(prop, options);
			monitor.start(options.interval);
			propView.addSubview(monitor);
		}
		else {
			const control = this.createControl_(model, options);
			control.getEmitter().on(
				Control.EVENT_CHANGE,
				(value) => {
					prop.setValue(value, true);
				}
			);
			propView.addSubview(control);
		}

		return propView;
	}

	static createProperty_(target, propName, model, options) {
		const builder = new PropertyBuilder(target, propName, model);
		if (options.forMonitor) {
			builder.setForMonitor(true);
		}
		if (options.id !== undefined) {
			builder.setId(options.id);
		}
		if (options.label !== undefined) {
			builder.setLabel(options.label);
		}
		return builder.build();
	}

	static createModel_(options) {
		throw Errors.notImplemented('createModel_');
	}

	static createControl_(model, options) {
		throw Errors.notImplemented('createControl_');
	}

	static createMonitor_(property, options) {
		throw Errors.notImplemented('createMonitor_');
	}

	static addConstraints_(model, options) {
		Object.keys(this.CONSTRAINT_FACTORIES).forEach((key) => {
			const value = options[key];
			if (value === undefined) {
				return;
			}

			const constraint = this.CONSTRAINT_FACTORIES[key](value);
			model.addConstraint(constraint);
		});
	}
}

module.exports = PropertyViewFactory
