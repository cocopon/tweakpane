const Codec = require('./codec');

class NumberCodec extends Codec {
	static canDecode(stringValue) {
		return !isNaN(Number(stringValue));
	}

	static decode(stringValue) {
		return Number(stringValue);
	}

	static encode(value) {
		return Number(value);
	}
}

module.exports = NumberCodec;
