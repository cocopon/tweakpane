import * as assert from 'assert';
import {describe, it as context, it} from 'mocha';

import {ViewProps} from './view-props';

describe(ViewProps.name, () => {
	[
		{
			params: undefined,
			expected: {
				disabled: false,
				disposed: false,
				hidden: false,
			},
		},
		{
			params: {},
			expected: {
				disabled: false,
				disposed: false,
				hidden: false,
			},
		},
		{
			params: {disabled: true},
			expected: {
				disabled: true,
				disposed: false,
				hidden: false,
			},
		},
		{
			params: {hidden: true},
			expected: {
				disabled: false,
				disposed: false,
				hidden: true,
			},
		},
	].forEach(({params, expected}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should set initial value', () => {
				const p = ViewProps.create(params);
				assert.strictEqual(p.get('disabled'), expected.disabled);
				assert.strictEqual(p.get('disposed'), expected.disposed);
				assert.strictEqual(p.get('hidden'), expected.hidden);
			});
		});
	});
});
