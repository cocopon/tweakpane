import * as assert from 'assert';
import {describe, it} from 'mocha';

import {
	BinaryOperationNode,
	NumberLiteralNode,
	UnaryOperationNode,
} from './nodes';

describe(NumberLiteralNode.name, () => {
	context('evaluate', () => {
		[
			{
				text: '123',
				expected: 123,
			},
			{
				text: '31416e-4',
				expected: 31416e-4,
			},
			{
				text: '0b0101',
				expected: 0b0101,
			},
			{
				text: '0x12ef',
				expected: 0x12ef,
			},
			{
				text: '0o7610',
				expected: 0o7610,
			},
		].forEach(({text, expected}) => {
			it(`should evaluate '${text}'`, () => {
				const l = new NumberLiteralNode(text);
				assert.strictEqual(l.evaluate(), expected);
			});
		});
	});

	it('should convert into string', () => {
		const text = '3.1416e-2';
		const l = new NumberLiteralNode(text);
		assert.strictEqual(l.toString(), text);
	});
});

describe(BinaryOperationNode.name, () => {
	it('should throw error for unexpected operator', () => {
		assert.throws(() => {
			new BinaryOperationNode(
				'@',
				new NumberLiteralNode('1'),
				new NumberLiteralNode('2'),
			).evaluate();
		});
	});
	it('should convert into string', () => {
		const op = new BinaryOperationNode(
			'**',
			new NumberLiteralNode('1'),
			new NumberLiteralNode('2'),
		);
		assert.strictEqual(op.toString(), 'b( 1 ** 2 )');
	});
});

describe(UnaryOperationNode.name, () => {
	it('should throw error for unexpected operator', () => {
		assert.throws(() => {
			new UnaryOperationNode('@', new NumberLiteralNode('1')).evaluate();
		});
	});
	it('should convert into string', () => {
		const op = new UnaryOperationNode('~', new NumberLiteralNode('1'));
		assert.strictEqual(op.toString(), 'u( ~ 1 )');
	});
});
