import PropertyBuilder from '../misc/property_builder';
import Control         from '../view/control/control';
import Monitor         from '../view/monitor/monitor';
import PropertyView    from '../view/property_view';

class PropertyViewFactory {
	static create(config) {
		const model = config.createModel();
		this.setUpConstraints_(
			model,
			config.constraintFactories,
			config.options
		);

		const prop = this.createProperty_(
			config.reference,
			model,
			config.options
		);
		prop.applySourceValue();

		const propView = new PropertyView(prop);
		const view = config.createView(prop);
		if (view instanceof Monitor) {
			view.start(config.options.interval);
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
