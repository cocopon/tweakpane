import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {createPushedBuffer, initializeBuffer} from './buffered-value';

describe('BufferedValue', () => {
	[
		{
			expected: [123],
			params: {
				bufferSize: 1,
				initialValue: 123,
			},
		},
		{
			expected: [0, undefined, undefined, undefined],
			params: {
				bufferSize: 4,
				initialValue: 0,
			},
		},
	].forEach(({expected, params}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should initialize buffer', () => {
				assert.deepStrictEqual(
					initializeBuffer(params.initialValue, params.bufferSize).rawValue,
					expected,
				);
			});
		});
	});

	[
		{
			expected: [0, 1, undefined],
			params: {
				buffer: [0, undefined, undefined],
				newValue: 1,
			},
		},
		{
			expected: [1, 2, 3, 4],
			params: {
				buffer: [0, 1, 2, 3],
				newValue: 4,
			},
		},
	].forEach(({expected, params}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should create pushed buffer', () => {
				assert.deepStrictEqual(
					createPushedBuffer(params.buffer, params.newValue),
					expected,
				);
			});
		});
	});
});
