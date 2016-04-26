const Errors = require('../misc/errors');

class Codec {
	static canDecode(value) {
		throw Errors.notImplemented('canDecode');
	}

	static decode(value) {
		throw Errors.notImplemented('decode');
	}

	static encode(value) {
		throw Errors.notImplemented('encode');
	}
}

module.exports = Codec;
