import {RangeConstraint} from '../../../common/constraint/range';
import {ValueController} from '../../../common/controller/value';
import {
	createNumberFormatter,
	parseNumber,
} from '../../../common/converter/number';
import {findNextTarget, supportsTouch} from '../../../common/dom-util';
import {Foldable} from '../../../common/model/foldable';
import {Value} from '../../../common/model/value';
import {connectValues} from '../../../common/model/value-sync';
import {ViewProps} from '../../../common/model/view-props';
import {NumberTextController} from '../../number/controller/number-text';
import {PickedColor} from '..//model/picked-color';
import {Color} from '../model/color';
import {ColorPickerView} from '../view/color-picker';
import {APaletteController} from './a-palette';
import {ColorTextController} from './color-text';
import {HPaletteController} from './h-palette';
import {SvPaletteController} from './sv-palette';

interface Config {
	pickedColor: PickedColor;
	supportsAlpha: boolean;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class ColorPickerController implements ValueController<Color> {
	public readonly foldable: Foldable;
	public readonly pickedColor: PickedColor;
	public readonly view: ColorPickerView;
	public readonly viewProps: ViewProps;
	public triggerElement: HTMLElement | null = null;
	private alphaIcs_: {
		palette: APaletteController;
		text: NumberTextController;
	} | null;
	private hPaletteIc_: HPaletteController;
	private svPaletteIc_: SvPaletteController;
	private tc_: ColorTextController;

	constructor(doc: Document, config: Config) {
		this.onFocusableElementBlur_ = this.onFocusableElementBlur_.bind(this);
		this.onKeyDown_ = this.onKeyDown_.bind(this);

		this.pickedColor = config.pickedColor;
		this.viewProps = config.viewProps;

		this.foldable = new Foldable();

		this.hPaletteIc_ = new HPaletteController(doc, {
			value: this.pickedColor.value,
			viewProps: this.viewProps,
		});
		this.svPaletteIc_ = new SvPaletteController(doc, {
			value: this.pickedColor.value,
			viewProps: this.viewProps,
		});
		this.alphaIcs_ = config.supportsAlpha
			? {
					palette: new APaletteController(doc, {
						value: this.pickedColor.value,
						viewProps: this.viewProps,
					}),
					text: new NumberTextController(doc, {
						draggingScale: 0.01,
						formatter: createNumberFormatter(2),
						parser: parseNumber,
						baseStep: 0.1,
						value: new Value(0, {
							constraint: new RangeConstraint({min: 0, max: 1}),
						}),
						viewProps: this.viewProps,
					}),
			  }
			: null;
		if (this.alphaIcs_) {
			connectValues({
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
		this.tc_ = new ColorTextController(doc, {
			parser: parseNumber,
			pickedColor: this.pickedColor,
			viewProps: this.viewProps,
		});

		this.view = new ColorPickerView(doc, {
			alphaViews: this.alphaIcs_
				? {
						palette: this.alphaIcs_.palette.view,
						text: this.alphaIcs_.text.view,
				  }
				: null,
			foldable: this.foldable,
			hPaletteView: this.hPaletteIc_.view,
			pickedColor: this.pickedColor,
			supportsAlpha: config.supportsAlpha,
			svPaletteView: this.svPaletteIc_.view,
			textView: this.tc_.view,
		});
		this.view.element.addEventListener('keydown', this.onKeyDown_);
		this.view.allFocusableElements.forEach((elem) => {
			elem.addEventListener('blur', this.onFocusableElementBlur_);
		});
	}

	get value(): Value<Color> {
		return this.pickedColor.value;
	}

	get textController(): ColorTextController {
		return this.tc_;
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
		if (ev.key === 'Escape') {
			this.foldable.expanded = false;
		}
	}
}
