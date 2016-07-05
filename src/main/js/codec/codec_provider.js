import BooleanCodec from '../codec/boolean_codec';
import ColorCodec   from '../codec/color_codec';
import NumberCodec  from '../codec/number_codec';
import StringCodec  from '../codec/string_codec';
import BooleanModel from '../model/property/boolean_model';
import ColorModel   from '../model/property/color_model';
import NumberModel  from '../model/property/number_model';
import StringModel  from '../model/property/string_model';

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
