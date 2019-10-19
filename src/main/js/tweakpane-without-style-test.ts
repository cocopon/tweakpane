import {assert} from 'chai';
import {describe, it} from 'mocha';

import {PaneError} from './misc/pane-error';
import {TestUtil} from './misc/test-util';
import {TweakpaneWithoutStyle} from './tweakpane-without-style';

describe(TweakpaneWithoutStyle.name, () => {
	it('should dispose with default container', () => {
		const doc = TestUtil.createWindow().document;
		const c = new TweakpaneWithoutStyle({
			document: doc,
		});

		assert.strictEqual(doc.body.hasChildNodes(), true);
		c.dispose();
		assert.strictEqual(doc.body.hasChildNodes(), false);
	});

	it('should dispose with specified container', () => {
		const doc = TestUtil.createWindow().document;
		const containerElem = doc.createElement('div');
		doc.body.appendChild(containerElem);

		const c = new TweakpaneWithoutStyle({
			container: containerElem,
			document: doc,
		});
		c.dispose();

		assert.strictEqual(doc.body.contains(containerElem), true);
		assert.strictEqual(containerElem.hasChildNodes(), false);
	});

	it("should throw 'alreadyDisposed' error", () => {
		const doc = TestUtil.createWindow().document;
		const c = new TweakpaneWithoutStyle({
			document: doc,
		});
		c.dispose();
		assert.throws(() => {
			c.dispose();
		}, PaneError);
	});
});
