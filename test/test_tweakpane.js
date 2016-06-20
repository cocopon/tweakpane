const Tweakpane = require('../src/main/js/tweakpane');

describe('Tweakpane', () => {
	it('should listen property change event', () => {
		const INITIAL_VALUE = 'initial';
		const CHANGED_VALUE = 'changed';
		const params = {
			prop: INITIAL_VALUE
		};
		const pane = new Tweakpane();

		const prop = pane.add(params, 'prop');
		const p = new Promise((resolve) => {
			prop.on('change', (value) => {
				assert.strictEqual(
					params.prop, CHANGED_VALUE,
					'Target value should be changed before firing property change event'
				);
				resolve(value);
			});
		}).then((value) => {
			assert.strictEqual(value, CHANGED_VALUE);
		});

		const inputElem = pane.getElement().querySelector('input[type=text]');
		inputElem.value = CHANGED_VALUE;
		const e = new Event('change');
		inputElem.dispatchEvent(e);

		return p;
	});

	it('should listen global change event', () => {
		const INITIAL_VALUE = 'initial';
		const CHANGED_VALUE = 'changed';
		const params = {
			prop: INITIAL_VALUE
		};
		const pane = new Tweakpane();

		pane.add(params, 'prop');
		const p = new Promise((resolve) => {
			pane.on('change', (value) => {
				assert.strictEqual(
					params.prop, CHANGED_VALUE,
					'Target value should be changed before firing global change event'
				);
				resolve(value);
			});
		}).then((value) => {
			assert.strictEqual(value, CHANGED_VALUE);
		});

		const inputElem = pane.getElement().querySelector('input[type=text]');
		inputElem.value = CHANGED_VALUE;
		const e = new Event('change');
		inputElem.dispatchEvent(e);

		return p;
	});

	it('should listen global change event for property in folder', () => {
		const INITIAL_VALUE = 'initial';
		const CHANGED_VALUE = 'changed';
		const params = {
			prop: INITIAL_VALUE
		};
		const pane = new Tweakpane();

		const f = pane.addFolder('folder');
		f.add(params, 'prop');
		const p = new Promise((resolve) => {
			pane.on('change', (value) => {
				assert.strictEqual(
					params.prop, CHANGED_VALUE,
					'Target value should be changed before firing global change event'
				);
				resolve(value);
			});
		}).then((value) => {
			assert.strictEqual(value, CHANGED_VALUE);
		});

		const inputElem = pane.getElement().querySelector('input[type=text]');
		inputElem.value = CHANGED_VALUE;
		const e = new Event('change');
		inputElem.dispatchEvent(e);

		return p;
	});
});
