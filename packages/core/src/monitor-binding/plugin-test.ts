import * as assert from 'assert';
import {describe, it} from 'mocha';

import {
	BufferedValueController,
	MonitorBindingController,
} from '../blade/binding/controller/monitor-binding.js';
import {BindingTarget} from '../common/binding/target.js';
import {stringFromUnknown} from '../common/converter/string.js';
import {BufferedValue} from '../common/model/buffered-value.js';
import {ViewProps} from '../common/model/view-props.js';
import {BaseMonitorParams} from '../common/params.js';
import {View} from '../common/view/view.js';
import {createTestWindow} from '../misc/dom-test-util.js';
import {
	createMonitorBindingController,
	MonitorBindingPlugin,
} from './plugin.js';

class TestView implements View {
	public readonly element: HTMLElement;

	constructor(doc: Document) {
		this.element = doc.createElement('div');
	}
}

class TestController implements BufferedValueController<string, TestView> {
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
			params: {
				readonly: true,
			},
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
		assert.strictEqual(bc.labelController.props.get('label'), 'foo');
		bc.viewProps.set('disposed', true);
	});

	it('should apply initial state', () => {
		const bc = createMonitorBindingController(TestPlugin, {
			document: createTestWindow().document,
			params: {
				disabled: true,
				hidden: true,
				label: 'bar',
			},
			target: new BindingTarget({foo: 'bar'}, 'foo'),
		}) as MonitorBindingController;

		assert.strictEqual(bc.labelController.props.get('label'), 'bar');
		assert.strictEqual(bc.viewProps.get('disabled'), true);
		assert.strictEqual(bc.viewProps.get('hidden'), true);
		assert.strictEqual(bc.labelController.props.get('label'), 'bar');
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

	it('should disable ticker', () => {
		const bc = createMonitorBindingController(TestPlugin, {
			document: createTestWindow().document,
			params: {},
			target: new BindingTarget({foo: 'bar'}, 'foo'),
		});
		assert.strictEqual(bc?.value.ticker.disabled, false);
		bc?.viewProps.set('disabled', true);
		assert.strictEqual(bc?.value.ticker.disabled, true);
	});

	it('should hide when label is empty', () => {
		const bc = createMonitorBindingController(TestPlugin, {
			document: createTestWindow().document,
			params: {
				label: null,
			},
			target: new BindingTarget({foo: 'bar'}, 'foo'),
		}) as MonitorBindingController;

		assert.strictEqual(bc.labelController.props.get('label'), null);
		bc.viewProps.set('disposed', true);
	});
});
