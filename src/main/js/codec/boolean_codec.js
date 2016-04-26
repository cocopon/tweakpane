const Codec = require('./codec');

class BooleanCodec extends Codec {
	static canDecode() {
		return true;
	}

	static decode(value) {
		return !!value;
	}

	static encode(value) {
		return !!value;
	}
}

module.exports = BooleanCodec;
