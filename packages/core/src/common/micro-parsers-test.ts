import * as assert from 'assert';
import {describe as context, describe} from 'mocha';

import {MicroParsers} from './micro-parsers.js';

describe('MicroParsers', () => {
	[
		{
			value: true,
			expected: {succeeded: true, value: true},
		},
		{
			value: undefined,
			expected: {succeeded: true, value: undefined},
		},
	].forEach(({value, expected}) => {
		context(`when ${JSON.stringify(value)}`, () => {
			it('should parse optional parameter', () => {
				assert.deepStrictEqual(MicroParsers.optional.boolean(value), expected);
			});
		});
	});

	[
		{
			value: true,
			expected: {succeeded: true, value: true},
		},
		{
			value: undefined,
			expected: {succeeded: false, value: undefined},
		},
	].forEach(({value, expected}) => {
		context(`when ${JSON.stringify(value)}`, () => {
			it('should parse required parameter', () => {
				assert.deepStrictEqual(MicroParsers.required.boolean(value), expected);
			});
		});
	});

	[
		{
			value: true,
			expected: {succeeded: true, value: true},
		},
		{
			value: 'hello',
			expected: {succeeded: false, value: undefined},
		},
	].forEach(({value, expected}) => {
		context(`when ${JSON.stringify(value)}`, () => {
			it('should parse boolean parameter', () => {
				assert.deepStrictEqual(MicroParsers.required.boolean(value), expected);
			});
		});
	});

	[
		{
			value: 123,
			expected: {succeeded: true, value: 123},
		},
		{
			value: '123',
			expected: {succeeded: false, value: undefined},
		},
	].forEach(({value, expected}) => {
		context(`when ${JSON.stringify(value)}`, () => {
			it('should parse number parameter', () => {
				assert.deepStrictEqual(MicroParsers.required.number(value), expected);
			});
		});
	});

	[
		{
			value: 'foo',
			expected: {succeeded: true, value: 'foo'},
		},
		{
			value: 123,
			expected: {succeeded: false, value: undefined},
		},
	].forEach(({value, expected}) => {
		context(`when ${JSON.stringify(value)}`, () => {
			it('should parse string parameter', () => {
				assert.deepStrictEqual(MicroParsers.required.string(value), expected);
			});
		});
	});

	[
		{
			params: {
				parser: MicroParsers.required.number,
				value: [1, 2, 3],
			},
			expected: {succeeded: true, value: [1, 2, 3]},
		},
		{
			params: {
				parser: MicroParsers.required.number,
				value: 123,
			},
			expected: {succeeded: false, value: undefined},
		},
		{
			params: {
				parser: MicroParsers.required.number,
				value: [1, 2, 'foo', 3],
			},
			expected: {succeeded: false, value: undefined},
		},
	].forEach(({params, expected}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should parse array parameter', () => {
				assert.deepStrictEqual(
					MicroParsers.required.array(params.parser)(params.value),
					expected,
				);
			});
		});
	});

	[
		{
			params: {
				parser: {
					foo: MicroParsers.required.number,
					bar: MicroParsers.required.string,
				},
				value: {
					foo: 123,
					bar: 'hello',
				},
			},
			expected: {succeeded: true, value: {foo: 123, bar: 'hello'}},
		},
		{
			params: {
				parser: {
					foo: MicroParsers.required.number,
					bar: MicroParsers.required.string,
				},
				value: null,
			},
			expected: {succeeded: false, value: undefined},
		},
		{
			params: {
				parser: {
					foo: MicroParsers.required.number,
					bar: MicroParsers.required.string,
				},
				value: {
					foo: 123,
					bar: true,
				},
			},
			expected: {succeeded: false, value: undefined},
		},
	].forEach(({params, expected}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should parse object parameter', () => {
				assert.deepStrictEqual(
					MicroParsers.required.object(params.parser)(params.value),
					expected,
				);
			});
		});
	});
});
