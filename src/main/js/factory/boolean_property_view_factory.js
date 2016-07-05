import BooleanModel         from '../model/property/boolean_model';
import ListConstraint       from '../constraint/list_constraint';
import CheckboxControl      from '../view/control/checkbox_control';
import ListControl          from '../view/control/list_control';
import CheckboxMonitor      from '../view/monitor/checkbox_monitor';
import PropertyViewFactory  from './property_view_factory';

const CONSTRAINT_FACTORIES = {
	/**
	 * Set the list of values.
	 * @param {string[]} items The list of display texts for true and false value.
	 * @return {Constraint}
	 */
	'values': (items) => {
		return new ListConstraint(
			items.map((item, index) => {
				return {
					name: item,
					value: (index === 0)
				};
			})
		);
	}
};

class BooleanPropertyViewFactory {
	static createCheckbox(ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = false;
		return PropertyViewFactory.create({
			reference: ref,
			constraintFactories: CONSTRAINT_FACTORIES,
			createModel: () => {
				return new BooleanModel();
			},
			createView: (prop) => {
				return new CheckboxControl(prop);
			},
			options: options
		});
	}

	static createSelector(ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = false;
		return PropertyViewFactory.create({
			reference: ref,
			constraintFactories: CONSTRAINT_FACTORIES,
			createModel: () => {
				return new BooleanModel();
			},
			createView: (prop) => {
				return new ListControl(prop);
			},
			options: options
		});
	}

	static createMonitor(ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = true;
		return PropertyViewFactory.create({
			reference: ref,
			constraintFactories: CONSTRAINT_FACTORIES,
			createModel: () => {
				return new BooleanModel();
			},
			createView: (prop) => {
				return new CheckboxMonitor(prop);
			},
			options: options
		});
	}
}

module.exports = BooleanPropertyViewFactory;
