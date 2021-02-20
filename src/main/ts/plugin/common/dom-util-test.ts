import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../misc/test-util';
import * as DomUtil from './dom-util';

describe('DomUtil', () => {
	it('should get index of child element', () => {
		const w = TestUtil.createWindow();
		const parent = w.document.createElement('div');
		const child = w.document.createElement('div');
		parent.appendChild(child);

		DomUtil.removeElement(child);
		assert.isNull(child.parentElement);
	});
	it('should get index of child element', () => {
		const w = TestUtil.createWindow();
		const parent = w.document.createElement('div');
		parent.appendChild(w.document.createElement('div'));
		parent.appendChild(w.document.createElement('div'));
		const child = w.document.createElement('div');
		parent.appendChild(child);
		parent.appendChild(w.document.createElement('div'));

		assert.strictEqual(DomUtil.indexOfChildElement(child), 2);
	});

	it('should return negative index if not found', () => {
		const w = TestUtil.createWindow();
		const parent = w.document.createElement('div');
		parent.appendChild(w.document.createElement('div'));
		parent.appendChild(w.document.createElement('div'));

		const elem = w.document.createElement('div');
		assert.strictEqual(DomUtil.indexOfChildElement(elem), -1);
	});
});
