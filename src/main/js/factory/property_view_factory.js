const Errors          = require('../misc/errors');
const PropertyBuilder = require('../misc/property_builder');
const Control         = require('../view/control/control');
const Monitor         = require('../view/monitor/monitor');
const PropertyView    = require('../view/property_view');

class PropertyViewFactory {
	static supports(_value) {
		throw Errors.notImplemented('supports');
	}

	static create(params) {
		const model = params.createModel();
		this.setUpConstraints_(
			model,
			params.constraintFactories,
			params.options
		);

		const prop = this.createProperty_(
			params.reference,
			model,
			params.options
		);
		prop.applySourceValue();

		const propView = new PropertyView(prop);
		const view = params.createView(prop);
		if (view instanceof Monitor) {
			view.start(params.options.interval);
		}
		else if (view instanceof Control) {
			view.getEmitter().on(
				Control.EVENT_CHANGE,
				(value) => {
					prop.setValue(value, true);
				}
			);
		}
		propView.addSubview(view);

		return propView;
	}

	static createProperty_(ref, model, options) {
		const builder = new PropertyBuilder(ref, model);
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

	static setUpConstraints_(model, factories, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};

		Object.keys(factories).forEach((key) => {
			const value = options[key];
			if (value === undefined) {
				return;
			}

			const constraint = factories[key](value);
			model.addConstraint(constraint);
		});
	}
}

module.exports = PropertyViewFactory
