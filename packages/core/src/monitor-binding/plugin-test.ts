import * as assert from 'assert';
import {describe, it} from 'mocha';

import {BindingTarget} from '../common/binding/target';
import {Controller} from '../common/controller/controller';
import {stringFromUnknown} from '../common/converter/string';
import {BufferedValue} from '../common/model/buffered-value';
import {ViewProps} from '../common/model/view-props';
import {BaseMonitorParams} from '../common/params';
import {View} from '../common/view/view';
import {createTestWindow} from '../misc/dom-test-util';
import {createMonitorBindingController, MonitorBindingPlugin} from './plugin';

class TestView implements View {
	public readonly element: HTMLElement;

	constructor(doc: Document) {
		this.element = doc.createElement('div');
	}
}

class TestController implements Controller<TestView> {
	public readonly value: BufferedValue<string>;
	public readonly view: TestView;
	public readonly viewProps: ViewProps;
	public disposed = false;

	constructor(
		doc: Document,
		config: {
			value: BufferedValue<string>;
			viewProps: ViewProps;
		},
	) {
		this.value = config.value;
		this.view = new TestView(doc);
		this.viewProps = config.viewProps;
		this.viewProps.handleDispose(() => {
			this.disposed = true;
		});
	}
}

const TestPlugin: MonitorBindingPlugin<string, BaseMonitorParams> = {
	id: 'test',
	type: 'monitor',
	accept: (ex) => {
		if (typeof ex !== 'string') {
			return null;
		}
		return {
			initialValue: ex,
			params: {},
		};
	},
	binding: {
		reader: (_) => stringFromUnknown,
	},
	controller: (args) => {
		return new TestController(args.document, {
			value: args.value,
			viewProps: args.viewProps,
		});
	},
};

describe(createMonitorBindingController.name, () => {
	it('should have default state', () => {
		const bc = createMonitorBindingController(TestPlugin, {
			document: createTestWindow().document,
			params: {},
			target: new BindingTarget({foo: 'bar'}, 'foo'),
		});

		assert.strictEqual(bc?.viewProps.get('disabled'), false);
		assert.strictEqual(bc?.viewProps.get('hidden'), false);
		bc.viewProps.set('disposed', true);
	});

	it('should apply initial state', () => {
		const bc = createMonitorBindingController(TestPlugin, {
			document: createTestWindow().document,
			params: {
				disabled: true,
				hidden: true,
			},
			target: new BindingTarget({foo: 'bar'}, 'foo'),
		});

		assert.strictEqual(bc?.viewProps.get('disabled'), true);
		assert.strictEqual(bc?.viewProps.get('hidden'), true);
		bc.viewProps.set('disposed', true);
	});

	it('should be able to handle disposing from plugin', () => {
		const bc = createMonitorBindingController(TestPlugin, {
			document: createTestWindow().document,
			params: {},
			target: new BindingTarget({foo: 'bar'}, 'foo'),
		});
		const c = bc?.valueController as TestController;
		assert.strictEqual(c.disposed, false);
		bc?.viewProps.set('disposed', true);
		assert.strictEqual(c.disposed, true);
	});
});
