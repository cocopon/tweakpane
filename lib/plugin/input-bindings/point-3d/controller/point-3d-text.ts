import {forceCast, isEmpty} from '../../../../misc/type-util';
import {ValueController} from '../../../common/controller/value';
import {Formatter} from '../../../common/converter/formatter';
import {Value} from '../../../common/model/value';
import {Parser} from '../../../common/reader/parser';
import {getStepForKey, getVerticalStepKeys} from '../../../common/ui';
import {Point3d} from '../model/point-3d';
import {Point3dTextView} from '../view/point-3d-text';

interface Axis {
	baseStep: number;
	formatter: Formatter<number>;
}

interface Config {
	axes: [Axis, Axis, Axis];
	parser: Parser<string, number>;
	value: Value<Point3d>;
}

/**
 * @hidden
 */
export class Point3dTextController implements ValueController<Point3d> {
	public readonly value: Value<Point3d>;
	public readonly view: Point3dTextView;
	private readonly parser_: Parser<string, number>;
	private readonly baseSteps_: [number, number, number];

	constructor(doc: Document, config: Config) {
		this.onInputChange_ = this.onInputChange_.bind(this);
		this.onInputKeyDown_ = this.onInputKeyDown_.bind(this);

		this.parser_ = config.parser;
		this.value = config.value;

		const axes = config.axes;
		this.baseSteps_ = [axes[0].baseStep, axes[1].baseStep, axes[2].baseStep];

		this.view = new Point3dTextView(doc, {
			formatters: [axes[0].formatter, axes[1].formatter, axes[2].formatter],
			value: this.value,
		});
		this.view.inputElements.forEach((inputElem) => {
			inputElem.addEventListener('change', this.onInputChange_);
			inputElem.addEventListener('keydown', this.onInputKeyDown_);
		});
	}

	private findIndexOfInputElem_(inputElem: HTMLInputElement): number | null {
		const inputElems = this.view.inputElements;
		for (let i = 0; i < inputElems.length; i++) {
			if (inputElems[i] === inputElem) {
				return i;
			}
		}
		return null;
	}

	private updateComponent_(index: number, newValue: number): void {
		const comps = this.value.rawValue.getComponents();
		const newComps = comps.map((comp, i) => {
			return i === index ? newValue : comp;
		});
		this.value.rawValue = new Point3d(newComps[0], newComps[1], newComps[2]);

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
		const inputElem: HTMLInputElement = forceCast(e.currentTarget);

		const parsedValue = this.parser_(inputElem.value);
		if (isEmpty(parsedValue)) {
			return;
		}
		const compIndex = this.findIndexOfInputElem_(inputElem);
		if (isEmpty(compIndex)) {
			return;
		}

		const step = getStepForKey(
			this.baseSteps_[compIndex],
			getVerticalStepKeys(e),
		);
		if (step === 0) {
			return;
		}

		this.updateComponent_(compIndex, parsedValue + step);
	}
}
