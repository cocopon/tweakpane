// @flow

import NumberFormatter from '../../formatter/number';
import ClassName from '../../misc/class-name';
import Color from '../../model/color';
import Foldable from '../../model/foldable';
import InputValue from '../../model/input-value';
import View from '../view';
import HPaletteInputView from './h-palette';
import SvPaletteInputView from './sv-palette';
import TextInputView from './text';

const className = ClassName('clp', 'input');

type Config = {
	foldable: Foldable,
	hPaletteInputView: HPaletteInputView,
	rgbInputViews: TextInputView<number>[],
	svPaletteInputView: SvPaletteInputView,
	value: InputValue<Color>,
};

export default class ColorPickerInputView extends View {
	+foldable: Foldable;
	+value: InputValue<Color>;
	compFormatter_: NumberFormatter;
	hPaletteView_: HPaletteInputView;
	rgbInputViews_: TextInputView<number>[];
	svPaletteView_: SvPaletteInputView;

	constructor(document: Document, config: Config) {
		super(document);

		(this: any).onFoldableChange_ = this.onFoldableChange_.bind(this);
		(this: any).onValueChange_ = this.onValueChange_.bind(this);

		this.compFormatter_ = new NumberFormatter(0);

		this.value = config.value;
		this.value.emitter.on('change', this.onValueChange_);

		this.foldable = config.foldable;
		this.foldable.emitter.on('change', this.onFoldableChange_);

		this.element.classList.add(className());

		const plElem = document.createElement('div');
		plElem.classList.add(className('pl'));

		const svElem = document.createElement('div');
		svElem.classList.add(className('sv'));
		this.svPaletteView_ = config.svPaletteInputView;
		svElem.appendChild(this.svPaletteView_.element);
		plElem.appendChild(svElem);

		const hElem = document.createElement('div');
		hElem.classList.add(className('h'));
		this.hPaletteView_ = config.hPaletteInputView;
		hElem.appendChild(this.hPaletteView_.element);
		plElem.appendChild(hElem);

		this.element.appendChild(plElem);

		const inputElems = document.createElement('div');
		inputElems.classList.add(className('is'));
		this.rgbInputViews_ = config.rgbInputViews;
		this.rgbInputViews_.forEach((iv, index) => {
			const elem = document.createElement('div');
			elem.classList.add(className('iw'));

			const labelElem = document.createElement('label');
			labelElem.classList.add(className('il'));
			labelElem.textContent = ['R', 'G', 'B'][index];

			elem.appendChild(labelElem);
			elem.appendChild(iv.element);
			inputElems.appendChild(elem);
		});
		this.element.appendChild(inputElems);

		this.update();
	}

	get allFocusableElements(): HTMLElement[] {
		return [].concat(
			this.hPaletteView_.canvasElement,
			this.svPaletteView_.canvasElement,
			this.rgbInputViews_.map((iv) => {
				return iv.inputElement;
			}),
		);
	}

	update(): void {
		if (this.foldable.expanded) {
			this.element.classList.add(className(null, 'expanded'));
		} else {
			this.element.classList.remove(className(null, 'expanded'));
		}

		this.rgbInputViews_.forEach((iv) => {
			iv.update();
		});
	}

	onValueChange_(): void {
		this.update();
	}

	onFoldableChange_(): void {
		this.update();
	}
}
