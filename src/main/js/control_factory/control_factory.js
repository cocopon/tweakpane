const Model        = require('../model/model');
const Property     = require('../model/property');
const Errors       = require('../misc/errors');
const Control      = require('../view/control/control');
const PropertyView = require('../view/property_view');

class ControlFactory {
	static supports(value) {
		throw Errors.notImplemented('supports');
	}

	static create(target, propName, options) {
		const model = this.createModel_(options);
		const prop = this.createProperty_(target, propName, model, options);
		prop.applySourceValue();

		const ControlClass = this.getControlClass_(options);
		const control = new ControlClass(model);
		control.getEmitter().on(
			Control.EVENT_CHANGE,
			(value) => {
				model.setValue(value);
			}
		);

		// TODO: Refactor
		if (options.onChange !== undefined) {
			model.getEmitter().on(
				Model.EVENT_CHANGE,
				options.onChange
			);
		}

		const propView = new PropertyView(prop);
		propView.addSubview(control);

		return propView;
	}

	static createProperty_(target, propName, model, options) {
		const prop = new Property(target, propName, model);
		if (options.id !== undefined) {
			prop.setId(options.id);
		}
		if (options.label !== undefined) {
			prop.setDisplayName(options.label);
		}
		return prop;
	}

	static createControl_(options) {
		const ControlClass = this.getControlClass_(options);
		const model = this.createModel_(options);
		return new ControlClass(model);
	}

	static getControlClass_(options) {
		throw Errors.notImplemented('getControlClass_');
	}

	static instanciateModel_() {
		throw Errors.notImplemented('instanciateModel_');
	}

	static createModel_(options) {
		const model = this.instanciateModel_();

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

module.exports = ControlFactory
