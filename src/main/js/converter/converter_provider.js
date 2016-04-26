const BooleanConverter = require('../converter/boolean_converter');
const ColorConverter   = require('../converter/color_converter');
const NumberConverter  = require('../converter/number_converter');
const StringConverter  = require('../converter/string_converter');
const BooleanModel     = require('../model/boolean_model');
const ColorModel       = require('../model/color_model');
const NumberModel      = require('../model/number_model');
const StringModel      = require('../model/string_model');

const CONVERTER_PAIRS = [
	[BooleanModel, BooleanConverter],
	[ColorModel, ColorConverter],
	[NumberModel, NumberConverter],
	[StringModel, StringConverter]
];

class ConverterProvider {
	static provide(model) {
		const pairs = CONVERTER_PAIRS.filter((pair) => {
			return model instanceof pair[0];
		});
		return pairs.length > 0 ?
			pairs[0][1] :
			null;
	}
}

module.exports = ConverterProvider;
