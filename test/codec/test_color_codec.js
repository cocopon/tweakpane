const ColorCodec = require('../../src/main/js/codec/color_codec');

describe('ColorCodec', () => {
	it('should determine if it can decode hex value', () => {
		assert.isTrue(ColorCodec.canDecode('#08f'));
		assert.isTrue(ColorCodec.canDecode('#fca840'));

		assert.isFalse(ColorCodec.canDecode('#'));
		assert.isFalse(ColorCodec.canDecode('#0'));
		assert.isFalse(ColorCodec.canDecode('#0246'));
		assert.isFalse(ColorCodec.canDecode('#02468ac'));
	});

	it('should decode hex value', () => {
		assert.sameMembers(ColorCodec.decode('#000'), [0, 0, 0]);
		assert.sameMembers(ColorCodec.decode('#08f'), [0, 0x88, 0xff]);
		assert.sameMembers(ColorCodec.decode('#fff'), [0xff, 0xff, 0xff]);

		assert.sameMembers(ColorCodec.decode('#000000'), [0, 0, 0]);
		assert.sameMembers(ColorCodec.decode('#2468ac'), [0x24, 0x68, 0xac]);
		assert.sameMembers(ColorCodec.decode('#ffffff'), [0xff, 0xff, 0xff]);
	});

	it('should encode value', () => {
		assert.strictEqual(ColorCodec.encode([0, 0, 0]), '#000000');
		assert.strictEqual(ColorCodec.encode([0xca, 0x86, 0x42]), '#ca8642');
		assert.strictEqual(ColorCodec.encode([0xff, 0xff, 0xff]), '#ffffff');
	});
});
