import {
	BaseInputParams,
	formatString,
	InputBindingPlugin,
	ParamsParsers,
	parseParams,
	stringFromUnknown,
	TextController,
	TpError,
	ValueMap,
	VERSION,
	ViewProps,
	writePrimitive,
} from '@tweakpane/core';
import * as assert from 'assert';
import {describe, it} from 'mocha';

import {Pane} from '..';
import {createTestWindow} from '../misc/test-util';

describe('Tweakpane', () => {
	it('should dispose with default container', () => {
		const doc = createTestWindow().document;
		const c = new Pane({
			document: doc,
		});

		assert.strictEqual(doc.body.hasChildNodes(), true);
		c.dispose();
		assert.strictEqual(doc.body.hasChildNodes(), false);
	});

	it('should dispose with specified container', () => {
		const doc = createTestWindow().document;
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
		const doc = createTestWindow().document;
		const c = new Pane({
			document: doc,
		});
		c.dispose();
		assert.throws(() => {
			c.dispose();
		}, TpError);
	});

	it('should expanded by default', () => {
		const doc = createTestWindow().document;
		const c = new Pane({
			document: doc,
			title: 'Title',
		});
		assert.strictEqual(c['controller_'].foldable?.get('expanded'), true);
	});

	it('should shrink by default with `expanded: false` option', () => {
		const doc = createTestWindow().document;
		const c = new Pane({
			document: doc,
			expanded: false,
			title: 'Title',
		});
		assert.strictEqual(c['controller_'].foldable?.get('expanded'), false);
	});

	it('should embed default style', () => {
		const doc = createTestWindow().document;
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
		const doc = createTestWindow().document;
		const pane = new Pane({
			document: doc,
		});
		pane.registerPlugin({
			plugin: {
				id: 'test',
				type: 'input',
				css: css,
				core: VERSION,
				accept: (value, params) => {
					if (typeof value !== 'string') {
						return null;
					}
					const p = ParamsParsers;
					const result = parseParams(params, {
						view: p.required.constant('test'),
					});
					return result
						? {
								initialValue: value,
								params: result,
						  }
						: null;
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
		const styleElem = doc.querySelector('style[data-tp-style=plugin-test]');
		assert.strictEqual(styleElem?.textContent, css);
	});
});
