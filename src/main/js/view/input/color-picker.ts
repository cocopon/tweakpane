import {ClassName} from '../../misc/class-name';
import {Color} from '../../model/color';
import {Foldable} from '../../model/foldable';
import {InputValue} from '../../model/input-value';
import {View, ViewConfig} from '../view';
import {ColorComponentTextsInputView} from './color-component-texts';
import {HPaletteInputView} from './h-palette';
import {SvPaletteInputView} from './sv-palette';

const className = ClassName('clp', 'input');

interface Config extends ViewConfig {
	componentTextsView: ColorComponentTextsInputView;
	foldable: Foldable;
	hPaletteInputView: HPaletteInputView;
	svPaletteInputView: SvPaletteInputView;
	value: InputValue<Color>;
}

/**
 * @hidden
 */
export class ColorPickerInputView extends View {
	public readonly foldable: Foldable;
	public readonly value: InputValue<Color>;
	private hPaletteView_: HPaletteInputView;
	private compTextsView_: ColorComponentTextsInputView;
	private svPaletteView_: SvPaletteInputView;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.onFoldableChange_ = this.onFoldableChange_.bind(this);
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.value = config.value;
		this.value.emitter.on('change', this.onValueChange_);

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

		this.element.appendChild(hsvElem);

		const rgbElem = document.createElement('div');
		rgbElem.classList.add(className('rgb'));
		this.compTextsView_ = config.componentTextsView;
		rgbElem.appendChild(this.compTextsView_.element);
		this.element.appendChild(rgbElem);

		this.update();
	}

	get allFocusableElements(): HTMLElement[] {
		return ([] as HTMLElement[]).concat(
			this.hPaletteView_.canvasElement,
			this.compTextsView_.inputElements,
			this.svPaletteView_.canvasElement,
		);
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
