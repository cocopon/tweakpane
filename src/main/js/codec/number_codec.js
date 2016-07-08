import Codec from './codec';

class NumberCodec extends Codec {
	static canDecode(value) {
		return !isNaN(Number(value));
	}

	static decode(value) {
		return Number(value);
	}

	static encode(value) {
		return Number(value);
	}
}

export default NumberCodec;
