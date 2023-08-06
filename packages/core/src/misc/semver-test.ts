import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {Semver} from './semver.js';

describe(Semver.name, () => {
	[
		{
			expected: {
				major: 0,
				minor: 0,
				patch: 0,
				prerelease: null,
				text: '0.0.0',
			},
			text: '0.0.0',
		},
		{
			expected: {
				major: 3,
				minor: 14,
				patch: 16,
				prerelease: null,
				text: '3.14.16',
			},
			text: '3.14.16',
		},
		{
			expected: {
				major: 0,
				minor: 1,
				patch: 100,
				prerelease: null,
				text: '0.1.100',
			},
			text: '0.01.0100',
		},
		{
			expected: {
				major: 1,
				minor: 2,
				patch: 3,
				prerelease: 'beta.0',
				text: '1.2.3-beta.0',
			},
			text: '1.2.3-beta.0',
		},
		{
			expected: {
				major: 1,
				minor: 1,
				patch: 5,
				prerelease: '0',
				text: '1.1.5-0',
			},
			text: '1.1.5-0',
		},
	].forEach(({expected, text}) => {
		context(`when ${JSON.stringify(text)}`, () => {
			it('should compare array deeply', () => {
				const semver = new Semver(text);
				assert.strictEqual(semver.major, expected.major);
				assert.strictEqual(semver.minor, expected.minor);
				assert.strictEqual(semver.patch, expected.patch);
				assert.strictEqual(semver.prerelease, expected.prerelease);
				assert.strictEqual(semver.toString(), expected.text);
			});
		});
	});
});
