const ListConstraint       = require('../constraint/list_constraint');
const LogRecordModel       = require('../model/property/log_record_model');
const StringModel          = require('../model/property/string_model');
const ListControl          = require('../view/control/list_control');
const TextControl          = require('../view/control/text_control');
const LogMonitor           = require('../view/monitor/log_monitor');
const MultilineTextMonitor = require('../view/monitor/multiline_text_monitor');
const TextMonitor          = require('../view/monitor/text_monitor');
const PropertyViewFactory  = require('./property_view_factory');

class StringPropertyViewFactory extends PropertyViewFactory {
	static supports(value) {
		return typeof(value) === 'string';
	}

	static createModel_(options) {
		if (options.forMonitor && options.count > 1) {
			return new LogRecordModel(options.count);
		}

		return new StringModel();
	}

	static createControl_(prop, options) {
		if (options.list !== undefined) {
			return new ListControl(prop);
		}

		return new TextControl(prop);
	}

	static createMonitor_(property, options) {
		if (options.multiline !== undefined) {
			return new MultilineTextMonitor(property);
		}
		if (options.count !== undefined) {
			return new LogMonitor(property);
		}
		return new TextMonitor(property);
	}

	static createText(ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		return PropertyViewFactory.create2({
			reference: ref,
			constraintFactories: this.CONSTRAINT_FACTORIES,
			createModel: () => {
				return new StringModel();
			},
			createView: (prop) => {
				return new TextControl(prop);
			},
			options: options
		});
	}

	static createListItems_(items) {
		// ['foo', 'bar']
		// => {'foo': 'foo', 'bar': 'bar'}
		if (Array.isArray(items)) {
			return items.map((value) => {
				return {
					name: value,
					value: value
				};
			});
		}

		const isObjectLiteral = Object.prototype.toString.call(items) === '[object Object]';
		if (isObjectLiteral) {
			return Object.keys(items).map((key) => {
				return {
					name: key,
					value: items[key]
				};
			});
		}

		return null;
	}
}

StringPropertyViewFactory.CONSTRAINT_FACTORIES = {
	/**
	 * Create the list of values constraint.
	 * @param {(string[]|Object.<string, string>)} items The list of values.
	 * @return {Constraint}
	 */
	'list': (items) => {
		return new ListConstraint(
			StringPropertyViewFactory.createListItems_(items)
		);
	}
};

module.exports = StringPropertyViewFactory;
