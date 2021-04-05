import {Constraint} from '../../../common/constraint/constraint';
import {ValueController} from '../../../common/controller/value';
import {Parser} from '../../../common/converter/parser';
import {Value} from '../../../common/model/value';
import {ViewProps} from '../../../common/model/view-props';
import {NumberTextProps} from '../../../common/number/view/number-text';
import {forceCast} from '../../../misc/type-util';
import {PointNdTextController} from '../../common/controller/point-nd-text';
import {Point2d, Point2dAssembly} from '../model/point-2d';
import {Point2dPadTextView} from '../view/point-2d-pad-text';
import {Point2dPadController} from './point-2d-pad';

interface Axis {
	baseStep: number;
	constraint: Constraint<number> | undefined;
	textProps: NumberTextProps;
}

interface Config {
	axes: [Axis, Axis];
	invertsY: boolean;
	maxValue: number;
	parser: Parser<number>;
	value: Value<Point2d>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class Point2dPadTextController implements ValueController<Point2d> {
	public readonly value: Value<Point2d>;
	public readonly view: Point2dPadTextView;
	public readonly viewProps: ViewProps;
	private readonly padIc_: Point2dPadController;
	private readonly textIc_: PointNdTextController<Point2d>;

	constructor(doc: Document, config: Config) {
		this.onPadButtonBlur_ = this.onPadButtonBlur_.bind(this);
		this.onPadButtonClick_ = this.onPadButtonClick_.bind(this);

		this.value = config.value;
		this.viewProps = config.viewProps;

		this.padIc_ = new Point2dPadController(doc, {
			baseSteps: [config.axes[0].baseStep, config.axes[1].baseStep],
			invertsY: config.invertsY,
			maxValue: config.maxValue,
			value: this.value,
			viewProps: this.viewProps,
		});

		this.textIc_ = new PointNdTextController(doc, {
			assembly: Point2dAssembly,
			axes: config.axes,
			parser: config.parser,
			value: this.value,
			viewProps: this.viewProps,
		});

		this.view = new Point2dPadTextView(doc, {
			padView: this.padIc_.view,
			textView: this.textIc_.view,
			viewProps: this.viewProps,
		});
		this.view.padButtonElement.addEventListener('blur', this.onPadButtonBlur_);
		this.view.padButtonElement.addEventListener(
			'click',
			this.onPadButtonClick_,
		);
		this.padIc_.triggerElement = this.view.padButtonElement;
	}

	private onPadButtonBlur_(e: FocusEvent) {
		const elem = this.view.element;
		const nextTarget: HTMLElement | null = forceCast(e.relatedTarget);
		if (!nextTarget || !elem.contains(nextTarget)) {
			this.padIc_.expanded.rawValue = false;
		}
	}

	private onPadButtonClick_(): void {
		this.padIc_.expanded.rawValue = !this.padIc_.expanded.rawValue;
		if (this.padIc_.expanded.rawValue) {
			this.padIc_.view.allFocusableElements[0].focus();
		}
	}
}
