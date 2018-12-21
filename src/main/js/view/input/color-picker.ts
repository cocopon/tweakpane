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

interface Config {
	foldable: Foldable;
	hPaletteInputView: HPaletteInputView;
	rgbInputViews: TextInputView<number>[];
	svPaletteInputView: SvPaletteInputView;
	value: InputValue<Color>;
}

export default class ColorPickerInputView extends View {
	public readonly foldable: Foldable;
	public readonly value: InputValue<Color>;
	private compFormatter_: NumberFormatter;
	private hPaletteView_: HPaletteInputView;
	private rgbInputViews_: TextInputView<number>[];
	private svPaletteView_: SvPaletteInputView;

	constructor(document: Document, config: Config) {
		super(document);

		this.onFoldableChange_ = this.onFoldableChange_.bind(this);
		this.onValueChange_ = this.onValueChange_.bind(this);

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
		return ([] as HTMLElement[]).concat(
			this.hPaletteView_.canvasElement,
			this.svPaletteView_.canvasElement,
			this.rgbInputViews_.map((iv) => {
				return iv.inputElement;
			}),
		);
	}

	public update(): void {
		if (this.foldable.expanded) {
			this.element.classList.add(className(undefined, 'expanded'));
		} else {
			this.element.classList.remove(className(undefined, 'expanded'));
		}

		this.rgbInputViews_.forEach((iv) => {
			iv.update();
		});
	}

	private onValueChange_(): void {
		this.update();
	}

	private onFoldableChange_(): void {
		this.update();
	}
}
