const NumberCodec = require('../../src/main/js/codec/number_codec');

describe('NumberCodec', () => {
	it('should determine if it can decode number value', () => {
		assert.isTrue(NumberCodec.canDecode(0));
		assert.isTrue(NumberCodec.canDecode(Number.MIN_VALUE));
		assert.isTrue(NumberCodec.canDecode(Number.MAX_VALUE));
	});

	it('should determine if it can decode string value', () => {
		assert.isTrue(NumberCodec.canDecode('0'));
		assert.isTrue(NumberCodec.canDecode('+1234567890'));
		assert.isTrue(NumberCodec.canDecode('-1234567890'));
		assert.isTrue(NumberCodec.canDecode(String(Math.PI)));
		assert.isTrue(NumberCodec.canDecode('-3.1416e10'));

		assert.isFalse(NumberCodec.canDecode('abc'));
	});

	it('should decode number value', () => {
		assert.strictEqual(NumberCodec.decode(0), 0);
		assert.strictEqual(NumberCodec.decode(Number.MIN_VALUE), Number.MIN_VALUE);
		assert.strictEqual(NumberCodec.decode(Number.MAX_VALUE), Number.MAX_VALUE);
	});

	it('should decode string value', () => {
		assert.strictEqual(NumberCodec.decode('0'), 0);
		assert.strictEqual(NumberCodec.decode('0123'), 123);
		assert.strictEqual(NumberCodec.decode('-3.1416'), -3.1416);
		assert.strictEqual(NumberCodec.decode('1.414e10'), 1.414e10);
	});

	it('should encode number value', () => {
		assert.strictEqual(NumberCodec.encode(0), 0);
		assert.strictEqual(NumberCodec.encode(Number.MIN_VALUE), Number.MIN_VALUE);
		assert.strictEqual(NumberCodec.encode(Number.MAX_VALUE), Number.MAX_VALUE);
	});

	it('should encode string value', () => {
		assert.strictEqual(NumberCodec.encode('0'), 0);
		assert.strictEqual(NumberCodec.encode('0123'), 123);
		assert.strictEqual(NumberCodec.encode('-3.1416'), -3.1416);
		assert.strictEqual(NumberCodec.encode('1.414e10'), 1.414e10);
	});
});
