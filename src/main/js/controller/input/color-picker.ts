import {TypeUtil} from '../../misc/type-util';
import {Color} from '../../model/color';
import {Foldable} from '../../model/foldable';
import {InputValue} from '../../model/input-value';
import {PickedColor} from '../../model/picked-color';
import {ViewModel} from '../../model/view-model';
import {StringNumberParser} from '../../parser/string-number';
import {ColorPickerInputView} from '../../view/input/color-picker';
import {APaletteInputController} from './a-palette';
import {ColorComponentTextsInputController} from './color-component-texts';
import {HPaletteInputController} from './h-palette';
import {InputController} from './input';
import {SvPaletteInputController} from './sv-palette';

interface Config {
	pickedColor: PickedColor;
	supportsAlpha: boolean;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class ColorPickerInputController implements InputController<Color> {
	public readonly viewModel: ViewModel;
	public readonly foldable: Foldable;
	public readonly pickedColor: PickedColor;
	public readonly view: ColorPickerInputView;
	private aPaletteIc_: APaletteInputController | null;
	private hPaletteIc_: HPaletteInputController;
	private compTextsIc_: ColorComponentTextsInputController;
	private svPaletteIc_: SvPaletteInputController;

	constructor(document: Document, config: Config) {
		this.onFocusableElementBlur_ = this.onFocusableElementBlur_.bind(this);
		this.onKeyDown_ = this.onKeyDown_.bind(this);

		this.pickedColor = config.pickedColor;
		this.foldable = new Foldable();

		this.viewModel = config.viewModel;

		this.hPaletteIc_ = new HPaletteInputController(document, {
			value: this.pickedColor.value,
			viewModel: this.viewModel,
		});
		this.svPaletteIc_ = new SvPaletteInputController(document, {
			value: this.pickedColor.value,
			viewModel: this.viewModel,
		});
		this.aPaletteIc_ = config.supportsAlpha
			? new APaletteInputController(document, {
					value: this.pickedColor.value,
					viewModel: this.viewModel,
			  })
			: null;
		this.compTextsIc_ = new ColorComponentTextsInputController(document, {
			parser: StringNumberParser,
			pickedColor: this.pickedColor,
			supportsAlpha: config.supportsAlpha,
			viewModel: this.viewModel,
		});

		this.view = new ColorPickerInputView(document, {
			aPaletteInputView: this.aPaletteIc_?.view || null,
			componentTextsView: this.compTextsIc_.view,
			foldable: this.foldable,
			hPaletteInputView: this.hPaletteIc_.view,
			model: this.viewModel,
			pickedColor: this.pickedColor,
			svPaletteInputView: this.svPaletteIc_.view,
		});
		this.view.element.addEventListener('keydown', this.onKeyDown_);
		this.view.allFocusableElements.forEach((elem) => {
			elem.addEventListener('blur', this.onFocusableElementBlur_);
		});
	}

	get value(): InputValue<Color> {
		return this.pickedColor.value;
	}

	private onFocusableElementBlur_(e: FocusEvent): void {
		const elem = this.view.element;
		const nextTarget: HTMLElement | null = TypeUtil.forceCast(e.relatedTarget);
		if (!nextTarget || !elem.contains(nextTarget)) {
			this.foldable.expanded = false;
		}
	}

	private onKeyDown_(ev: KeyboardEvent): void {
		if (ev.keyCode === 27) {
			this.foldable.expanded = false;
		}
	}
}
