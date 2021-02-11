import {Point2dConstraint} from '../../constraint/point-2d';
import {Formatter} from '../../formatter/formatter';
import {TypeUtil} from '../../misc/type-util';
import {InputValue} from '../../model/input-value';
import {Point2d} from '../../model/point-2d';
import {ViewModel} from '../../model/view-model';
import {Parser} from '../../parser/parser';
import {Point2dTextInputView} from '../../view/input/point-2d-text';
import * as UiUtil from '../ui-util';
import {InputController} from './input';

interface Config {
	parser: Parser<string, number>;
	value: InputValue<Point2d>;
	viewModel: ViewModel;
	xFormatter: Formatter<number>;
	yFormatter: Formatter<number>;
}

/**
 * @hidden
 */
export class Point2dTextInputController implements InputController<Point2d> {
	public readonly viewModel: ViewModel;
	public readonly value: InputValue<Point2d>;
	public readonly view: Point2dTextInputView;
	private readonly parser_: Parser<string, number>;
	private readonly xStep_: number;
	private readonly yStep_: number;

	constructor(document: Document, config: Config) {
		this.onInputChange_ = this.onInputChange_.bind(this);
		this.onInputKeyDown_ = this.onInputKeyDown_.bind(this);

		this.parser_ = config.parser;
		this.value = config.value;

		const c = this.value.constraint;
		this.xStep_ = UiUtil.getStepForTextInput(
			c instanceof Point2dConstraint ? c.xConstraint : undefined,
		);
		this.yStep_ = UiUtil.getStepForTextInput(
			c instanceof Point2dConstraint ? c.yConstraint : undefined,
		);

		this.viewModel = config.viewModel;
		this.view = new Point2dTextInputView(document, {
			model: this.viewModel,
			value: this.value,
			xFormatter: config.xFormatter,
			yFormatter: config.yFormatter,
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
		const inputElem: HTMLInputElement = TypeUtil.forceCast(e.currentTarget);

		const parsedValue = this.parser_(inputElem.value);
		if (TypeUtil.isEmpty(parsedValue)) {
			return;
		}
		const compIndex = this.findIndexOfInputElem_(inputElem);
		if (TypeUtil.isEmpty(compIndex)) {
			return;
		}

		const step = UiUtil.getStepForKey(
			compIndex === 0 ? this.xStep_ : this.yStep_,
			UiUtil.getVerticalStepKeys(e),
		);
		if (step === 0) {
			return;
		}

		this.updateComponent_(compIndex, parsedValue + step);
	}
}
