import ListConstraint       from '../constraint/list_constraint';
import MaxNumberConstraint  from '../constraint/max_number_constraint';
import MinNumberConstraint  from '../constraint/min_number_constraint';
import StepNumberConstraint from '../constraint/step_number_constraint';
import NumberRecordModel   from '../model/property/number_record_model';
import NumberModel          from '../model/property/number_model';
import ListControl          from '../view/control/list_control';
import NumberTextControl    from '../view/control/number_text_control';
import SliderTextControl    from '../view/control/slider_text_control';
import GraphMonitor         from '../view/monitor/graph_monitor';
import NumberTextMonitor    from '../view/monitor/number_text_monitor';
import PropertyViewFactory  from './property_view_factory';

const CONSTRAINT_FACTORIES = {
	/**
	 * Create the minimum value constraint.
	 * @param {number} value The minimum value.
	 * @return {Constraint}
	 */
	'min': (value) => {
		return new MinNumberConstraint(value);
	},
	/**
	 * Create the maximum value constraint.
	 * @param {number} value The maximum value.
	 * @return {Constraint}
	 */
	'max': (value) => {
		return new MaxNumberConstraint(value);
	},
	/**
	 * Create the step value constraint.
	 * @param {number} value The step value.
	 * @return {Constraint}
	 */
	'step': (value) => {
		return new StepNumberConstraint(value);
	},
	/**
	 * Create the list of values constraint.
	 * @param {Object.<string, number>} items The list of values.
	 * @return {Constraint}
	 */
	'values': (items) => {
		return new ListConstraint(
			Object.keys(items).map((key) => {
				return {
					name: key,
					value: items[key]
				};
			})
		);
	}
};

class NumberPropertyViewFactory {
	static createText(ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = false;
		return PropertyViewFactory.create({
			reference: ref,
			constraintFactories: CONSTRAINT_FACTORIES,
			createModel: () => {
				return new NumberModel();
			},
			createView: (prop) => {
				return new NumberTextControl(prop);
			},
			options: options
		});
	}

	static createSlider(ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = false;
		return PropertyViewFactory.create({
			reference: ref,
			constraintFactories: CONSTRAINT_FACTORIES,
			createModel: () => {
				return new NumberModel();
			},
			createView: (prop) => {
				return new SliderTextControl(prop);
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
				return new NumberModel();
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
				return new NumberModel();
			},
			createView: (prop) => {
				return new NumberTextMonitor(prop);
			},
			options: options
		});
	}

	static createGraph(ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = true;
		return PropertyViewFactory.create({
			reference: ref,
			constraintFactories: CONSTRAINT_FACTORIES,
			createModel: () => {
				return new NumberRecordModel(options.count);
			},
			createView: (prop) => {
				return new GraphMonitor(prop);
			},
			options: options
		});
	}
}

module.exports = NumberPropertyViewFactory;
