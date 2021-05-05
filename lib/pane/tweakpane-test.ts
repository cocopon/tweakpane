import * as assert from 'assert';
import {describe, it} from 'mocha';

import {Pane, registerPlugin} from '..';
import {TextController} from '../common/controller/text';
import {formatString, stringFromUnknown} from '../common/converter/string';
import {ValueMap} from '../common/model/value-map';
import {ViewProps} from '../common/model/view-props';
import {BaseInputParams} from '../common/params';
import {writePrimitive} from '../common/primitive';
import {TpError} from '../common/tp-error';
import {InputBindingPlugin} from '../input-binding/plugin';
import {TestUtil} from '../misc/test-util';

describe('Tweakpane', () => {
	it('should dispose with default container', () => {
		const doc = TestUtil.createWindow().document;
		const c = new Pane({
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

		const c = new Pane({
			container: containerElem,
			document: doc,
		});
		c.dispose();

		assert.strictEqual(doc.body.contains(containerElem), true);
		assert.strictEqual(containerElem.hasChildNodes(), false);
	});

	it("should throw 'alreadyDisposed' error", () => {
		const doc = TestUtil.createWindow().document;
		const c = new Pane({
			document: doc,
		});
		c.dispose();
		assert.throws(() => {
			c.dispose();
		}, TpError);
	});

	it('should expanded by default', () => {
		const doc = TestUtil.createWindow().document;
		const c = new Pane({
			document: doc,
			title: 'Title',
		});
		assert.strictEqual(c.controller_.foldable?.get('expanded'), true);
	});

	it('should shrink by default with `expanded: false` option', () => {
		const doc = TestUtil.createWindow().document;
		const c = new Pane({
			document: doc,
			expanded: false,
			title: 'Title',
		});
		assert.strictEqual(c.controller_.foldable?.get('expanded'), false);
	});

	it('should embed default style', () => {
		const doc = TestUtil.createWindow().document;
		new Pane({
			document: doc,
		});
		assert.notStrictEqual(
			doc.querySelector('style[data-tp-style=default]'),
			null,
		);
	});

	it('should embed plugin style', () => {
		const css = '.tp-tstv{color:white;}';
		registerPlugin({
			type: 'input',
			plugin: {
				id: 'test',
				css: css,
				accept: (value, args) => {
					return args.view !== 'test'
						? null
						: typeof value !== 'string'
						? null
						: value;
				},
				binding: {
					reader: () => stringFromUnknown,
					writer: () => writePrimitive,
				},
				controller: (args) => {
					return new TextController(args.document, {
						parser: (v) => v,
						props: ValueMap.fromObject({
							formatter: formatString,
						}),
						value: args.value,
						viewProps: ViewProps.create(),
					});
				},
			} as InputBindingPlugin<string, string, BaseInputParams>,
		});
		const doc = TestUtil.createWindow().document;
		new Pane({
			document: doc,
		});
		const styleElem = doc.querySelector('style[data-tp-style=plugin-test]');
		assert.strictEqual(styleElem?.textContent, css);
	});
});
