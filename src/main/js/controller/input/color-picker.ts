import {TypeUtil} from '../../misc/type-util';
import {Color} from '../../model/color';
import {Foldable} from '../../model/foldable';
import {InputValue} from '../../model/input-value';
import {ViewModel} from '../../model/view-model';
import {StringNumberParser} from '../../parser/string-number';
import {ColorPickerInputView} from '../../view/input/color-picker';
import {APaletteInputController} from './a-palette';
import {ColorComponentTextsInputController} from './color-component-texts';
import {HPaletteInputController} from './h-palette';
import {InputController} from './input';
import {SvPaletteInputController} from './sv-palette';

interface Config {
	supportsAlpha: boolean;
	value: InputValue<Color>;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class ColorPickerInputController implements InputController<Color> {
	public readonly viewModel: ViewModel;
	public readonly foldable: Foldable;
	public readonly value: InputValue<Color>;
	public readonly view: ColorPickerInputView;
	private aPaletteIc_: APaletteInputController | null;
	private hPaletteIc_: HPaletteInputController;
	private compTextsIc_: ColorComponentTextsInputController;
	private svPaletteIc_: SvPaletteInputController;

	constructor(document: Document, config: Config) {
		this.onFocusableElementBlur_ = this.onFocusableElementBlur_.bind(this);

		this.value = config.value;
		this.foldable = new Foldable();

		this.viewModel = config.viewModel;

		this.hPaletteIc_ = new HPaletteInputController(document, {
			value: this.value,
			viewModel: this.viewModel,
		});
		this.svPaletteIc_ = new SvPaletteInputController(document, {
			value: this.value,
			viewModel: this.viewModel,
		});
		this.aPaletteIc_ = config.supportsAlpha
			? new APaletteInputController(document, {
					value: this.value,
					viewModel: this.viewModel,
			  })
			: null;
		this.compTextsIc_ = new ColorComponentTextsInputController(document, {
			parser: StringNumberParser,
			supportsAlpha: config.supportsAlpha,
			value: this.value,
			viewModel: this.viewModel,
		});

		this.view = new ColorPickerInputView(document, {
			aPaletteInputView: this.aPaletteIc_?.view || null,
			foldable: this.foldable,
			hPaletteInputView: this.hPaletteIc_.view,
			model: this.viewModel,
			componentTextsView: this.compTextsIc_.view,
			svPaletteInputView: this.svPaletteIc_.view,
			value: this.value,
		});
		this.view.allFocusableElements.forEach((elem) => {
			elem.addEventListener('blur', this.onFocusableElementBlur_);
		});
	}

	private onFocusableElementBlur_(e: FocusEvent): void {
		const elem = this.view.element;
		const nextTarget: HTMLElement | null = TypeUtil.forceCast(e.relatedTarget);
		if (!nextTarget || !elem.contains(nextTarget)) {
			this.foldable.expanded = false;
		}
	}
}
