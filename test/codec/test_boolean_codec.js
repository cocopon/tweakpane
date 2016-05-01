const BooleanCodec = require('../../src/main/js/codec/boolean_codec');

describe('BooleanCodec', () => {
	it('should determine if it can decode any type of value', () => {
		assert.isTrue(BooleanCodec.canDecode(true));
		assert.isTrue(BooleanCodec.canDecode(false));
		assert.isTrue(BooleanCodec.canDecode(0));
		assert.isTrue(BooleanCodec.canDecode('0'));
	});

	it('should decode value', () => {
		assert.isTrue(BooleanCodec.decode(true));
		assert.isFalse(BooleanCodec.decode(false));

		assert.isFalse(BooleanCodec.decode(0));
		assert.isTrue(BooleanCodec.decode('hello'));

		assert.isFalse(BooleanCodec.decode('false'));
	});

	it('should encode value', () => {
		assert.strictEqual(BooleanCodec.encode(true), true);
		assert.strictEqual(BooleanCodec.encode(false), false);

		assert.strictEqual(BooleanCodec.encode(0), false);
		assert.strictEqual(BooleanCodec.encode('hello'), true);

		assert.strictEqual(BooleanCodec.encode('false'), false);
	});
});
