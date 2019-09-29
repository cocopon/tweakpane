import CompositeConstraint from '../../constraint/composite';
import RangeConstraint from '../../constraint/range';
import StepConstraint from '../../constraint/step';
import NumberFormatter from '../../formatter/number';
import TypeUtil from '../../misc/type-util';
import Color from '../../model/color';
import Foldable from '../../model/foldable';
import InputValue from '../../model/input-value';
import NumberParser from '../../parser/number';
import ColorPickerInputView from '../../view/input/color-picker';
import HPaletteInputController from './h-palette';
import NumberTextInputController from './number-text';
import SvPaletteInputController from './sv-palette';

import {InputController} from './input';

interface Config {
	value: InputValue<Color>;
}

const COMPONENT_CONSTRAINT = new CompositeConstraint({
	constraints: [
		new RangeConstraint({
			max: 255,
			min: 0,
		}),
		new StepConstraint({
			step: 1,
		}),
	],
});

/**
 * @hidden
 */
export default class ColorPickerInputController
	implements InputController<Color> {
	public readonly foldable: Foldable;
	public readonly value: InputValue<Color>;
	public readonly view: ColorPickerInputView;
	private hPaletteIc_: HPaletteInputController;
	private rgbIcs_: NumberTextInputController[];
	private svPaletteIc_: SvPaletteInputController;

	constructor(document: Document, config: Config) {
		this.onInputBlur_ = this.onInputBlur_.bind(this);
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.value = config.value;
		this.value.emitter.on('change', this.onValueChange_);

		this.foldable = new Foldable();

		this.hPaletteIc_ = new HPaletteInputController(document, {
			value: this.value,
		});

		this.svPaletteIc_ = new SvPaletteInputController(document, {
			value: this.value,
		});

		const initialComps = this.value.rawValue.getComponents('rgb');
		const rgbValues = [0, 1, 2].map((index) => {
			return new InputValue(initialComps[index], COMPONENT_CONSTRAINT);
		});
		rgbValues.forEach((compValue, index) => {
			compValue.emitter.on('change', (rawValue: number) => {
				const comps = this.value.rawValue.getComponents('hsv');
				if (index === 0 || index === 1 || index === 2) {
					comps[index] = rawValue;
				}
				this.value.rawValue = new Color(comps, 'hsv');
			});
		});
		this.rgbIcs_ = rgbValues.map((compValue) => {
			return new NumberTextInputController(document, {
				formatter: new NumberFormatter(0),
				parser: NumberParser,
				value: compValue,
			});
		});

		this.view = new ColorPickerInputView(document, {
			foldable: this.foldable,
			hPaletteInputView: this.hPaletteIc_.view,
			rgbInputViews: this.rgbIcs_.map((ic) => {
				return ic.view;
			}),
			svPaletteInputView: this.svPaletteIc_.view,
			value: this.value,
		});
		this.view.allFocusableElements.forEach((elem) => {
			elem.addEventListener('blur', this.onInputBlur_);
		});
	}

	public dispose(): void {
		this.view.dispose();
	}

	private onInputBlur_(e: FocusEvent): void {
		const elem = this.view.element;
		const nextTarget: HTMLElement | null = TypeUtil.forceCast(e.relatedTarget);
		if (!nextTarget || !elem.contains(nextTarget)) {
			this.foldable.expanded = false;
		}
	}

	private onValueChange_(): void {
		const comps = this.value.rawValue.getComponents('rgb');
		this.rgbIcs_.forEach((ic, index) => {
			ic.value.rawValue = comps[index];
		});
	}
}
