class StringCodec {
	static canDecode() {
		return true;
	}

	static decode(stringValue) {
		return stringValue;
	}

	static encode(value) {
		return value;
	}
}

module.exports = StringCodec;
