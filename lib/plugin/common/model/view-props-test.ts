import * as assert from 'assert';
import {describe, it as context, it} from 'mocha';

import {createViewProps} from './view-props';

describe(createViewProps.name, () => {
	[
		{
			params: undefined,
			expected: {
				disabled: false,
				hidden: false,
			},
		},
		{
			params: {},
			expected: {
				disabled: false,
				hidden: false,
			},
		},
		{
			params: {disabled: true},
			expected: {
				disabled: true,
				hidden: false,
			},
		},
		{
			params: {hidden: true},
			expected: {
				disabled: false,
				hidden: true,
			},
		},
	].forEach(({params, expected}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should set initial value', () => {
				const p = createViewProps(params);
				assert.strictEqual(p.get('disabled'), expected.disabled);
				assert.strictEqual(p.get('hidden'), expected.hidden);
			});
		});
	});
});
