import {
	BaseInputParams,
	formatString,
	InputBindingPlugin,
	parseRecord,
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

import {createTestWindow} from '../misc/test-util.js';
import {Pane} from './pane.js';

describe(Pane.name, () => {
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

	it("should throw 'alreadyDisposed' error for duplicate disposing", () => {
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
		assert.strictEqual(c.controller.foldable?.get('expanded'), true);
	});

	it('should shrink by default with `expanded: false` option', () => {
		const doc = createTestWindow().document;
		const c = new Pane({
			document: doc,
			expanded: false,
			title: 'Title',
		});
		assert.strictEqual(c.controller.foldable?.get('expanded'), false);
	});

	it('should embed default style', () => {
		const doc = createTestWindow().document;
		new Pane({
			document: doc,
		});
		assert.notStrictEqual(
			doc.querySelector('style[data-tp-style=plugin-default]'),
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
			id: 'test',
			css: css,
			plugin: {
				id: 'test',
				type: 'input',
				core: VERSION,
				accept: (value, params) => {
					if (typeof value !== 'string') {
						return null;
					}
					const result = parseRecord(params, (p) => ({
						view: p.required.constant('test'),
					}));
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

	it('should handle blade created in other pane', (done) => {
		const doc = createTestWindow().document;
		const pane1 = new Pane({document: doc});
		const f = pane1.addFolder({title: 'folder'});
		const b = f.addBinding({foo: 1}, 'foo');
		const pane2 = new Pane({document: doc});

		// Indirectly add a blade that is created in other pane
		pane2.add(f);
		pane2.on('change', (ev) => {
			assert.strictEqual(ev.target, b);
			done();
		});

		b.controller.value.rawValue = 2;
	});
});
