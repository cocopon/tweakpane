import {ValueController} from '../../../common/controller/value';
import {findNextTarget, supportsTouch} from '../../../common/dom-util';
import {NumberFormatter} from '../../../common/formatter/number';
import {Color} from '../../../common/model/color';
import {Foldable} from '../../../common/model/foldable';
import {PickedColor} from '../../../common/model/picked-color';
import {Value} from '../../../common/model/value';
import {connect} from '../../../common/model/value-sync';
import {ViewModel} from '../../../common/model/view-model';
import {StringNumberParser} from '../../../common/parser/string-number';
import {TextController} from '../../common/controller/text';
import {NumberTextController} from '../../number/controller/number-text';
import {ColorPickerView} from '../view/color-picker';
import {APaletteController} from './a-palette';
import {ColorComponentTextsController} from './color-component-texts';
import {HPaletteController} from './h-palette';
import {SvPaletteController} from './sv-palette';

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
			connect({
				primary: this.pickedColor.value,
				secondary: this.alphaIcs_.text.value,
				forward: (p) => {
					return p.rawValue.getComponents()[3];
				},
				backward: (p, s) => {
					const comps = p.rawValue.getComponents();
					comps[3] = s.rawValue;
					return new Color(comps, p.rawValue.mode);
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
		const nextTarget = findNextTarget(ev);
		if (nextTarget && elem.contains(nextTarget)) {
			// Next target is in the picker
			return;
		}
		if (
			nextTarget &&
			nextTarget === this.triggerElement &&
			!supportsTouch(elem.ownerDocument)
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
