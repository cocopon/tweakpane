const StringCodec = require('../../src/main/js/codec/string_codec');

describe('StringCodec', () => {
	it('should determine if it can decode any type of value', () => {
		assert.isTrue(StringCodec.canDecode(0));
		assert.isTrue(StringCodec.canDecode(true));
		assert.isTrue(StringCodec.canDecode('0'));
	});

	it('should decode value', () => {
		assert.strictEqual(StringCodec.decode(0), '0');
		assert.strictEqual(StringCodec.decode(true), 'true');
		assert.strictEqual(StringCodec.decode('hello'), 'hello');
	});

	it('should encode value', () => {
		assert.strictEqual(StringCodec.encode(0), '0');
		assert.strictEqual(StringCodec.encode(true), 'true');
		assert.strictEqual(StringCodec.encode('hello'), 'hello');
	});
});
