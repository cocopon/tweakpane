import {ClassName} from '../../misc/class-name';
import {TypeUtil} from '../../misc/type-util';
import {Color} from '../../model/color';
import {Foldable} from '../../model/foldable';
import {InputValue} from '../../model/input-value';
import {PickedColor} from '../../model/picked-color';
import {View, ViewConfig} from '../view';
import {APaletteInputView} from './a-palette';
import {ColorComponentTextsInputView} from './color-component-texts';
import {HPaletteInputView} from './h-palette';
import {InputView} from './input';
import {SvPaletteInputView} from './sv-palette';

const className = ClassName('clp', 'input');

interface Config extends ViewConfig {
	aPaletteInputView: APaletteInputView | null;
	componentTextsView: ColorComponentTextsInputView;
	foldable: Foldable;
	hPaletteInputView: HPaletteInputView;
	pickedColor: PickedColor;
	svPaletteInputView: SvPaletteInputView;
}

/**
 * @hidden
 */
export class ColorPickerInputView extends View implements InputView<Color> {
	public readonly foldable: Foldable;
	public readonly pickedColor: PickedColor;
	private aPaletteView_: APaletteInputView | null;
	private hPaletteView_: HPaletteInputView;
	private compTextsView_: ColorComponentTextsInputView;
	private svPaletteView_: SvPaletteInputView;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.onFoldableChange_ = this.onFoldableChange_.bind(this);
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.pickedColor = config.pickedColor;
		this.pickedColor.value.emitter.on('change', this.onValueChange_);

		this.foldable = config.foldable;
		this.foldable.emitter.on('change', this.onFoldableChange_);

		this.element.classList.add(className());

		const hsvElem = document.createElement('div');
		hsvElem.classList.add(className('hsv'));

		const svElem = document.createElement('div');
		svElem.classList.add(className('sv'));
		this.svPaletteView_ = config.svPaletteInputView;
		svElem.appendChild(this.svPaletteView_.element);
		hsvElem.appendChild(svElem);

		const hElem = document.createElement('div');
		hElem.classList.add(className('h'));
		this.hPaletteView_ = config.hPaletteInputView;
		hElem.appendChild(this.hPaletteView_.element);
		hsvElem.appendChild(hElem);

		this.aPaletteView_ = config.aPaletteInputView;
		if (this.aPaletteView_) {
			const aElem = document.createElement('div');
			aElem.classList.add(className('a'));
			aElem.appendChild(this.aPaletteView_.element);
			hsvElem.appendChild(aElem);
		}

		this.element.appendChild(hsvElem);

		const rgbElem = document.createElement('div');
		rgbElem.classList.add(className('rgb'));
		this.compTextsView_ = config.componentTextsView;
		rgbElem.appendChild(this.compTextsView_.element);
		this.element.appendChild(rgbElem);

		this.update();
	}

	get allFocusableElements(): HTMLElement[] {
		const elems = [
			this.svPaletteView_.element,
			this.hPaletteView_.element,
			...this.compTextsView_.inputElements,
		];
		if (this.aPaletteView_) {
			elems.push(this.aPaletteView_.element);
		}
		return TypeUtil.forceCast(elems);
	}

	get value(): InputValue<Color> {
		return this.pickedColor.value;
	}

	public update(): void {
		if (this.foldable.expanded) {
			this.element.classList.add(className(undefined, 'expanded'));
		} else {
			this.element.classList.remove(className(undefined, 'expanded'));
		}
	}

	private onValueChange_(): void {
		this.update();
	}

	private onFoldableChange_(): void {
		this.update();
	}
}
