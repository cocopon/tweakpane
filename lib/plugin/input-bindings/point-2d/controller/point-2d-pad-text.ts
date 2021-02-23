import {forceCast} from '../../../../misc/type-util';
import {ValueController} from '../../../common/controller/value';
import {Value} from '../../../common/model/value';
import {Parser} from '../../../common/reader/parser';
import {Formatter} from '../../../common/writer/formatter';
import {Point2d} from '../model/point-2d';
import {Point2dPadTextView} from '../view/point-2d-pad-text';
import {Point2dPadController} from './point-2d-pad';
import {Point2dTextController} from './point-2d-text';

interface Axis {
	baseStep: number;
	formatter: Formatter<number>;
}

interface Config {
	axes: [Axis, Axis];
	invertsY: boolean;
	maxValue: number;
	parser: Parser<string, number>;
	value: Value<Point2d>;
}

/**
 * @hidden
 */
export class Point2dPadTextController implements ValueController<Point2d> {
	public readonly value: Value<Point2d>;
	public readonly view: Point2dPadTextView;
	private readonly padIc_: Point2dPadController;
	private readonly textIc_: Point2dTextController;

	constructor(doc: Document, config: Config) {
		this.onPadButtonBlur_ = this.onPadButtonBlur_.bind(this);
		this.onPadButtonClick_ = this.onPadButtonClick_.bind(this);

		this.value = config.value;

		this.padIc_ = new Point2dPadController(doc, {
			baseSteps: [config.axes[0].baseStep, config.axes[1].baseStep],
			invertsY: config.invertsY,
			maxValue: config.maxValue,
			value: this.value,
		});

		this.textIc_ = new Point2dTextController(doc, {
			axes: config.axes,
			parser: config.parser,
			value: this.value,
		});

		this.view = new Point2dPadTextView(doc, {
			padView: this.padIc_.view,
			textView: this.textIc_.view,
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
			this.padIc_.foldable.expanded = false;
		}
	}

	private onPadButtonClick_(): void {
		this.padIc_.foldable.expanded = !this.padIc_.foldable.expanded;
		if (this.padIc_.foldable.expanded) {
			this.padIc_.view.allFocusableElements[0].focus();
		}
	}
}
