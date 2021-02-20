import {assert} from 'chai';
import {describe, it} from 'mocha';

import Tweakpane from '..';
import {TestUtil} from '../misc/test-util';
import * as StringConverter from '../plugin/common/converter/string';
import {StringFormatter} from '../plugin/common/formatter/string';
import {ViewModel} from '../plugin/common/model/view-model';
import {PaneError} from '../plugin/common/pane-error';
import {TextController} from '../plugin/input-bindings/common/controller/text';

describe(Tweakpane.name, () => {
	it('should dispose with default container', () => {
		const doc = TestUtil.createWindow().document;
		const c = new Tweakpane({
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

		const c = new Tweakpane({
			container: containerElem,
			document: doc,
		});
		c.dispose();

		assert.strictEqual(doc.body.contains(containerElem), true);
		assert.strictEqual(containerElem.hasChildNodes(), false);
	});

	it("should throw 'alreadyDisposed' error", () => {
		const doc = TestUtil.createWindow().document;
		const c = new Tweakpane({
			document: doc,
		});
		c.dispose();
		assert.throws(() => {
			c.dispose();
		}, PaneError);
	});

	it('should expanded by default', () => {
		const doc = TestUtil.createWindow().document;
		const c = new Tweakpane({
			document: doc,
			title: 'Title',
		});
		assert.strictEqual(c.controller.folder?.expanded, true);
	});

	it('should shrink by default with `expanded: false` option', () => {
		const doc = TestUtil.createWindow().document;
		const c = new Tweakpane({
			document: doc,
			expanded: false,
			title: 'Title',
		});
		assert.strictEqual(c.controller.folder?.expanded, false);
	});

	it('should embed default style', () => {
		const doc = TestUtil.createWindow().document;
		new Tweakpane({
			document: doc,
		});
		assert.isNotNull(doc.querySelector('style[data-tp-style=default]'));
	});

	it('should embed plugin style', () => {
		const css = '.tp-tstv{color:white;}';
		Tweakpane.registerPlugin<string, string>({
			type: 'input',
			plugin: {
				id: 'test',
				css: css,
				model: {
					accept: (value, args) => {
						return args.view !== 'test'
							? null
							: typeof value !== 'string'
							? null
							: value;
					},
					reader: () => StringConverter.fromMixed,
					writer: () => (v: string) => v,
				},
				controller: (args) => {
					return new TextController(args.document, {
						formatter: new StringFormatter(),
						parser: (v) => v,
						value: args.binding.value,
						viewModel: new ViewModel(),
					});
				},
			},
		});
		const doc = TestUtil.createWindow().document;
		new Tweakpane({
			document: doc,
		});
		const styleElem = doc.querySelector('style[data-tp-style=plugin-test]');
		assert.strictEqual(styleElem?.textContent, css);
	});
});
