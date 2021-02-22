import {forceCast, isEmpty} from '../../../../misc/type-util';
import {ValueController} from '../../../common/controller/value';
import {Color} from '../../../common/model/color';
import {ColorComponents4, ColorMode} from '../../../common/model/color-model';
import {PickedColor} from '../../../common/model/picked-color';
import {Value} from '../../../common/model/value';
import {Parser} from '../../../common/reader/parser';
import {
	getBaseStepForColor,
	getStepForKey,
	getVerticalStepKeys,
} from '../../../common/ui';
import {ColorComponentTextsView} from '../view/color-component-texts';

interface Config {
	parser: Parser<string, number>;
	pickedColor: PickedColor;
}

/**
 * @hidden
 */
export class ColorComponentTextsController implements ValueController<Color> {
	public readonly pickedColor: PickedColor;
	public readonly view: ColorComponentTextsView;
	private parser_: Parser<string, number>;

	constructor(doc: Document, config: Config) {
		this.onModeSelectChange_ = this.onModeSelectChange_.bind(this);
		this.onInputChange_ = this.onInputChange_.bind(this);
		this.onInputKeyDown_ = this.onInputKeyDown_.bind(this);

		this.parser_ = config.parser;
		this.pickedColor = config.pickedColor;

		this.view = new ColorComponentTextsView(doc, {
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

	get value(): Value<Color> {
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
		const inputElem: HTMLInputElement = forceCast(e.currentTarget);

		const parsedValue = this.parser_(inputElem.value);
		if (isEmpty(parsedValue)) {
			return;
		}
		const compIndex = this.findIndexOfInputElem_(inputElem);
		if (isEmpty(compIndex)) {
			return;
		}
		this.updateComponent_(compIndex, parsedValue);
	}

	private onInputKeyDown_(e: KeyboardEvent): void {
		const compIndex = this.findIndexOfInputElem_(
			e.currentTarget as HTMLElement | null,
		);
		const step = getStepForKey(
			getBaseStepForColor(compIndex === 3),
			getVerticalStepKeys(e),
		);
		if (step === 0) {
			return;
		}

		const inputElem: HTMLInputElement = forceCast(e.currentTarget);
		const parsedValue = this.parser_(inputElem.value);
		if (isEmpty(parsedValue)) {
			return;
		}
		if (isEmpty(compIndex)) {
			return;
		}
		this.updateComponent_(compIndex, parsedValue + step);
	}

	private onModeSelectChange_(ev: Event) {
		const selectElem = ev.currentTarget as HTMLSelectElement;
		this.pickedColor.mode = selectElem.value as ColorMode;
	}
}
