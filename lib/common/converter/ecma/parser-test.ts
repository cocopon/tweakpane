import * as assert from 'assert';
import {describe, it} from 'mocha';

import {parseEcmaNumberExpression} from './parser';

describe(parseEcmaNumberExpression.name, () => {
	[
		// Number literals
		{text: '123', expected: 123},
		{text: '98+', expected: undefined},
		{text: '\t3.1416 ', expected: 3.1416},
		{text: '.12', expected: 0.12},
		{text: '.', expected: undefined},
		{text: '1e2', expected: 1e2},
		{text: '2e-5', expected: 2e-5},
		{text: '3e+5', expected: 3e5},
		{text: '89.012e-5', expected: +89.012e-5},
		{text: '1e', expected: undefined},
		{text: '1e+', expected: undefined},
		{text: '1e-a', expected: undefined},
		{text: '0b0101', expected: 0b0101},
		{text: '0B1001001', expected: 0b1001001},
		{text: '0b', expected: undefined},
		{text: '0b3', expected: undefined},
		{text: '0b0102', expected: undefined},
		{text: '0o01357', expected: 0o1357},
		{text: '0O246', expected: 0o246},
		{text: '0o', expected: undefined},
		{text: '0o9', expected: undefined},
		{text: '0o2468', expected: undefined},
		{text: '0x012def', expected: 0x012def},
		{text: '0Xff8800', expected: 0xff8800},
		{text: '0x', expected: undefined},
		{text: '0xy', expected: undefined},
		{text: '0x13fg', expected: undefined},
		{text: '', expected: undefined},
		{text: '\t', expected: undefined},
		// Unary operators
		{text: '-45', expected: -45},
		{text: '+67', expected: +67},
		{text: '~1023', expected: ~1023},
		{text: '~', expected: undefined},
		{text: '@24', expected: undefined},
		// Binary operations (single)
		{text: '2 ** 3', expected: 2 ** 3},
		{text: '2 * 3.1416', expected: 2 * 3.1416},
		{text: '1 / 6', expected: 1 / 6},
		{text: '219 % 10', expected: 219 % 10},
		{text: '12+34', expected: 12 + 34},
		{text: '98 - 76', expected: 98 - 76},
		{text: '9 << 3', expected: 9 << 3},
		{text: '-9 >> 2', expected: -9 >> 2},
		{text: '-9 >>> 2', expected: -9 >>> 2},
		{text: '5 & 3', expected: 5 & 3},
		{text: '5 | 3', expected: 5 | 3},
		{text: '5 ^ 3', expected: 5 ^ 3},
		{text: '1 - -2', expected: 1 - -2},
		{text: '11 @ 5', expected: undefined},
		// Binary operations (multiple)
		{text: '1.2+3.4-5.6+7.8', expected: 1.2 + 3.4 - 5.6 + 7.8},
		{text: '2 * 3 + 4', expected: 2 * 3 + 4},
		{text: '2 - 3 / 4', expected: 2 - 3 / 4},
		{text: '2 - 3 / 4  ', expected: 2 - 3 / 4},
		{text: '2 * 3 +', expected: undefined},
		// Parenthesis
		{text: '( 3776  )', expected: 3776},
		{text: '(12 - 34)*56', expected: (12 - 34) * 56},
		{text: '12 - (34*56)', expected: 12 - 34 * 56},
		{text: '(12-(34/2))*56', expected: (12 - 34 / 2) * 56},
		{text: '-(-42)', expected: -(-42)},
		{text: '(@', expected: undefined},
		{text: '( 2 * 2', expected: undefined},
	].forEach(({text, expected}) => {
		it(`should evaluate number expression: '${text}'`, () => {
			const r = parseEcmaNumberExpression(text);
			assert.strictEqual(r?.evaluate(), expected);
		});
	});
});
