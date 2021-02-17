import {NumberFormatter} from '../../formatter/number';
import * as DomUtil from '../../misc/dom-util';
import {Color} from '../../model/color';
import {Foldable} from '../../model/foldable';
import * as ModelSync from '../../model/model-sync';
import {PickedColor} from '../../model/picked-color';
import {Value} from '../../model/value';
import {ViewModel} from '../../model/view-model';
import {StringNumberParser} from '../../parser/string-number';
import {ColorPickerView} from '../../view/input/color-picker';
import {APaletteController} from './a-palette';
import {ColorComponentTextsController} from './color-component-texts';
import {HPaletteController} from './h-palette';
import {NumberTextController} from './number-text';
import {SvPaletteController} from './sv-palette';
import {TextController} from './text';
import {ValueController} from './value';

interface Config {
	pickedColor: PickedColor;
	supportsAlpha: boolean;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class ColorPickerController implements ValueController<Color> {
	public readonly viewModel: ViewModel;
	public readonly foldable: Foldable;
	public readonly pickedColor: PickedColor;
	public readonly view: ColorPickerView;
	public triggerElement: HTMLElement | null = null;
	private alphaIcs_: {
		palette: APaletteController;
		text: TextController<number>;
	} | null;
	private hPaletteIc_: HPaletteController;
	private compTextsIc_: ColorComponentTextsController;
	private svPaletteIc_: SvPaletteController;

	constructor(document: Document, config: Config) {
		this.onFocusableElementBlur_ = this.onFocusableElementBlur_.bind(this);
		this.onKeyDown_ = this.onKeyDown_.bind(this);

		this.pickedColor = config.pickedColor;
		this.foldable = new Foldable();

		this.viewModel = config.viewModel;

		this.hPaletteIc_ = new HPaletteController(document, {
			value: this.pickedColor.value,
			viewModel: this.viewModel,
		});
		this.svPaletteIc_ = new SvPaletteController(document, {
			value: this.pickedColor.value,
			viewModel: this.viewModel,
		});
		this.alphaIcs_ = config.supportsAlpha
			? {
					palette: new APaletteController(document, {
						value: this.pickedColor.value,
						viewModel: this.viewModel,
					}),
					text: new NumberTextController(document, {
						formatter: new NumberFormatter(2),
						parser: StringNumberParser,
						baseStep: 0.1,
						value: new Value(0),
						viewModel: this.viewModel,
					}),
			  }
			: null;
		if (this.alphaIcs_) {
			ModelSync.connect({
				primary: {
					apply(from, to) {
						to.rawValue = from.value.rawValue.getComponents()[3];
					},
					emitter: (m) => m.value.emitter,
					value: this.pickedColor,
				},
				secondary: {
					apply(from, to) {
						const comps = to.value.rawValue.getComponents();
						comps[3] = from.rawValue;
						to.value.rawValue = new Color(comps, to.value.rawValue.mode);
					},
					emitter: (m) => m.emitter,
					value: this.alphaIcs_.text.value,
				},
			});
		}
		this.compTextsIc_ = new ColorComponentTextsController(document, {
			parser: StringNumberParser,
			pickedColor: this.pickedColor,
			viewModel: this.viewModel,
		});

		this.view = new ColorPickerView(document, {
			alphaViews: this.alphaIcs_
				? {
						palette: this.alphaIcs_.palette.view,
						text: this.alphaIcs_.text.view,
				  }
				: null,
			componentTextsView: this.compTextsIc_.view,
			foldable: this.foldable,
			hPaletteView: this.hPaletteIc_.view,
			model: this.viewModel,
			pickedColor: this.pickedColor,
			supportsAlpha: config.supportsAlpha,
			svPaletteView: this.svPaletteIc_.view,
		});
		this.view.element.addEventListener('keydown', this.onKeyDown_);
		this.view.allFocusableElements.forEach((elem) => {
			elem.addEventListener('blur', this.onFocusableElementBlur_);
		});
	}

	get value(): Value<Color> {
		return this.pickedColor.value;
	}

	private onFocusableElementBlur_(ev: FocusEvent): void {
		const elem = this.view.element;
		const nextTarget = DomUtil.findNextTarget(ev);
		if (nextTarget && elem.contains(nextTarget)) {
			// Next target is in the picker
			return;
		}
		if (
			nextTarget &&
			nextTarget === this.triggerElement &&
			!DomUtil.supportsTouch(elem.ownerDocument)
		) {
			// Next target is the trigger button
			return;
		}

		this.foldable.expanded = false;
	}

	private onKeyDown_(ev: KeyboardEvent): void {
		if (ev.keyCode === 27) {
			this.foldable.expanded = false;
		}
	}
}
