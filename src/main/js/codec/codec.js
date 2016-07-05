import Errors from '../misc/errors';

/**
 * Codec provides a way to convert between model value and value from JSON or input element.
 */
class Codec {
	/**
	 * Returns whether it can decode a value.
	 * @param {} value A value
	 * @return {boolean} true if it can decode a value
	 */
	static canDecode(_value) {
		throw Errors.notImplemented('canDecode');
	}

	/**
	 * Decodes a value.
	 * @param {} value A value
	 * @return {} A decoded value
	 */
	static decode(_value) {
		throw Errors.notImplemented('decode');
	}

	/**
	 * Encodes a value.
	 * @param {} value A value
	 * @return {} A encoded value
	 */
	static encode(_value) {
		throw Errors.notImplemented('encode');
	}
}

module.exports = Codec;
