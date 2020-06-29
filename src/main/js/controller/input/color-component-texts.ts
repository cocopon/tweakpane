import {ColorComponents4, ColorMode} from '../../misc/color-model';
import {TypeUtil} from '../../misc/type-util';
import {Color} from '../../model/color';
import {InputValue} from '../../model/input-value';
import {PickedColor} from '../../model/picked-color';
import {ViewModel} from '../../model/view-model';
import {Parser} from '../../parser/parser';
import {ColorComponentTextsInputView} from '../../view/input/color-component-texts';
import * as UiUtil from '../ui-util';
import {InputController} from './input';

interface Config {
	parser: Parser<string, number>;
	pickedColor: PickedColor;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class ColorComponentTextsInputController
	implements InputController<Color> {
	public readonly viewModel: ViewModel;
	public readonly pickedColor: PickedColor;
	public readonly view: ColorComponentTextsInputView;
	private parser_: Parser<string, number>;

	constructor(document: Document, config: Config) {
		this.onModeSelectChange_ = this.onModeSelectChange_.bind(this);
		this.onInputChange_ = this.onInputChange_.bind(this);
		this.onInputKeyDown_ = this.onInputKeyDown_.bind(this);

		this.parser_ = config.parser;
		this.pickedColor = config.pickedColor;

		this.viewModel = config.viewModel;
		this.view = new ColorComponentTextsInputView(document, {
			model: this.viewModel,
			pickedColor: this.pickedColor,
		});
		this.view.inputElements.forEach((inputElem) => {
			inputElem.addEventListener('change', this.onInputChange_);
			inputElem.addEventListener('keydown', this.onInputKeyDown_);
		});
		this.view.modeSelectElement.addEventListener(
			'change',
			this.onModeSelectChange_,
		);
	}

	get value(): InputValue<Color> {
		return this.pickedColor.value;
	}

	private findIndexOfInputElem_(inputElem: HTMLElement | null): number | null {
		const inputElems = this.view.inputElements;
		for (let i = 0; i < inputElems.length; i++) {
			if (inputElems[i] === inputElem) {
				return i;
			}
		}
		return null;
	}

	private updateComponent_(index: number, newValue: number): void {
		const mode = this.pickedColor.mode;
		const comps = this.value.rawValue.getComponents(mode);
		const newComps = comps.map((comp, i) => {
			return i === index ? newValue : comp;
		}) as ColorComponents4;
		this.value.rawValue = new Color(newComps, mode);

		this.view.update();
	}

	private onInputChange_(e: Event): void {
		const inputElem: HTMLInputElement = TypeUtil.forceCast(e.currentTarget);

		const parsedValue = this.parser_(inputElem.value);
		if (TypeUtil.isEmpty(parsedValue)) {
			return;
		}
		const compIndex = this.findIndexOfInputElem_(inputElem);
		if (TypeUtil.isEmpty(compIndex)) {
			return;
		}
		this.updateComponent_(compIndex, parsedValue);
	}

	private onInputKeyDown_(e: KeyboardEvent): void {
		const compIndex = this.findIndexOfInputElem_(
			e.currentTarget as HTMLElement | null,
		);
		const step = UiUtil.getStepForKey(
			UiUtil.getBaseStepForColor(compIndex === 3),
			UiUtil.getVerticalStepKeys(e),
		);
		if (step === 0) {
			return;
		}

		const inputElem: HTMLInputElement = TypeUtil.forceCast(e.currentTarget);
		const parsedValue = this.parser_(inputElem.value);
		if (TypeUtil.isEmpty(parsedValue)) {
			return;
		}
		if (TypeUtil.isEmpty(compIndex)) {
			return;
		}
		this.updateComponent_(compIndex, parsedValue + step);
	}

	private onModeSelectChange_(ev: Event) {
		const selectElem = ev.currentTarget as HTMLSelectElement;
		this.pickedColor.mode = selectElem.value as ColorMode;
	}
}
