const BooleanCodec = require('../codec/boolean_codec');
const ColorCodec   = require('../codec/color_codec');
const NumberCodec  = require('../codec/number_codec');
const StringCodec  = require('../codec/string_codec');
const BooleanModel = require('../model/boolean_model');
const ColorModel   = require('../model/color_model');
const NumberModel  = require('../model/number_model');
const StringModel  = require('../model/string_model');

const CODEC_PAIRS = [
	[BooleanModel, BooleanCodec],
	[ColorModel, ColorCodec],
	[NumberModel, NumberCodec],
	[StringModel, StringCodec]
];

class CodecProvider {
	static provide(model) {
		const pairs = CODEC_PAIRS.filter((pair) => {
			return model instanceof pair[0];
		});
		return pairs.length > 0 ?
			pairs[0][1] :
			null;
	}
}

module.exports = CodecProvider;
