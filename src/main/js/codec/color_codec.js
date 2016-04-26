const Errors = require('../misc/errors');
const Codec  = require('./codec');

class ColorCodec extends Codec {
	/**
	 * @param {string} value
	 * @return {boolean}
	 */
	static canDecode(value) {
		return this.VALIDATION_PATTERN.test(value);
	}

	/**
	 * @param {string} value
	 * @return {number[]}
	 */
	static decode(value) {
		if (this.SHORT_PATTERN.test(value)) {
			// '#rgb'
			return [
				parseInt(value.substr(1, 1), 16),
				parseInt(value.substr(2, 1), 16),
				parseInt(value.substr(3, 1), 16)
			].map((c) => {
				return (c << 4) | c;
			});
		}

		if (this.LONG_PATTERN.test(value)) {
			// '#rrggbb'
			return [
				parseInt(value.substr(1, 2), 16),
				parseInt(value.substr(3, 2), 16),
				parseInt(value.substr(5, 2), 16)
			];
		}

		throw Errors.shouldNotHappen();
	}

	/**
	 * @param {number[]} value
	 * @return {string}
	 */
	static encode(value) {
		return '#' + value.map((comp) => {
			const hex = comp.toString(16);
			return (hex.length === 1) ?
				`0${hex}` :
				hex;
		}).join('');
	}
}

ColorCodec.VALIDATION_PATTERN = /^#[0-9a-f]{3}|[0-9a-f]{6}$/i;
ColorCodec.SHORT_PATTERN = /^#[0-9a-f]{3}$/i;
ColorCodec.LONG_PATTERN = /^#[0-9a-f]{6}$/i;

module.exports = ColorCodec;
