const ListConstraint       = require('../constraint/list_constraint');
const StringModel          = require('../model/string_model');
const StringRecordModel    = require('../model/string_record_model');
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
			return new StringRecordModel();
		}

		return new StringModel();
	}

	static createControl_(model, options) {
		if (options.list !== undefined) {
			return new ListControl(model);
		}

		return new TextControl(model);
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
