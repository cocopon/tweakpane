const Codec = require('./codec');

class BooleanCodec extends Codec {
	static canDecode() {
		return true;
	}

	static decode(value) {
		return (value === 'false') ?
			false :
			!!value;
	}

	static encode(value) {
		return (value === 'false') ?
			false :
			!!value;
	}
}

module.exports = BooleanCodec;
