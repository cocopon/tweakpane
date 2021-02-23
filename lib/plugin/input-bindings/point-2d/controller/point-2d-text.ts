import {forceCast, isEmpty} from '../../../../misc/type-util';
import {ValueController} from '../../../common/controller/value';
import {Value} from '../../../common/model/value';
import {Parser} from '../../../common/reader/parser';
import {getStepForKey, getVerticalStepKeys} from '../../../common/ui';
import {Formatter} from '../../../common/writer/formatter';
import {Point2d} from '../model/point-2d';
import {Point2dTextView} from '../view/point-2d-text';

interface Axis {
	baseStep: number;
	formatter: Formatter<number>;
}

interface Config {
	axes: [Axis, Axis];
	parser: Parser<string, number>;
	value: Value<Point2d>;
}

/**
 * @hidden
 */
export class Point2dTextController implements ValueController<Point2d> {
	public readonly value: Value<Point2d>;
	public readonly view: Point2dTextView;
	private readonly parser_: Parser<string, number>;
	private readonly baseSteps_: [number, number];

	constructor(doc: Document, config: Config) {
		this.onInputChange_ = this.onInputChange_.bind(this);
		this.onInputKeyDown_ = this.onInputKeyDown_.bind(this);

		this.parser_ = config.parser;
		this.value = config.value;

		this.baseSteps_ = [config.axes[0].baseStep, config.axes[1].baseStep];

		this.view = new Point2dTextView(doc, {
			formatters: [config.axes[0].formatter, config.axes[1].formatter],
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
		this.value.rawValue = new Point2d(newComps[0], newComps[1]);

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
