import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createTestWindow} from '../misc/dom-test-util';
import {indexOfChildElement, removeElement} from './dom-util';

describe('DomUtil', () => {
	it('should get index of child element', () => {
		const w = createTestWindow();
		const parent = w.document.createElement('div');
		const child = w.document.createElement('div');
		parent.appendChild(child);

		removeElement(child);
		assert.strictEqual(child.parentElement, null);
	});
	it('should get index of child element', () => {
		const w = createTestWindow();
		const parent = w.document.createElement('div');
		parent.appendChild(w.document.createElement('div'));
		parent.appendChild(w.document.createElement('div'));
		const child = w.document.createElement('div');
		parent.appendChild(child);
		parent.appendChild(w.document.createElement('div'));

		assert.strictEqual(indexOfChildElement(child), 2);
	});

	it('should return negative index if not found', () => {
		const w = createTestWindow();
		const parent = w.document.createElement('div');
		parent.appendChild(w.document.createElement('div'));
		parent.appendChild(w.document.createElement('div'));

		const elem = w.document.createElement('div');
		assert.strictEqual(indexOfChildElement(elem), -1);
	});
});
