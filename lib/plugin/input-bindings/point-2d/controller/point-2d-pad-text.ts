import {forceCast} from '../../../../misc/type-util';
import {ValueController} from '../../../common/controller/value';
import {Formatter} from '../../../common/converter/formatter';
import {Parser} from '../../../common/converter/parser';
import {Value} from '../../../common/model/value';
import {PointNdTextController} from '../../common/controller/point-nd-text';
import {Point2d, Point2dAssembly} from '../model/point-2d';
import {Point2dPadTextView} from '../view/point-2d-pad-text';
import {Point2dPadController} from './point-2d-pad';

interface Axis {
	baseStep: number;
	draggingScale: number;
	formatter: Formatter<number>;
}

interface Config {
	axes: [Axis, Axis];
	invertsY: boolean;
	maxValue: number;
	parser: Parser<number>;
	value: Value<Point2d>;
}

/**
 * @hidden
 */
export class Point2dPadTextController implements ValueController<Point2d> {
	public readonly value: Value<Point2d>;
	public readonly view: Point2dPadTextView;
	private readonly padIc_: Point2dPadController;
	private readonly textIc_: PointNdTextController<Point2d>;

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

		this.textIc_ = new PointNdTextController(doc, {
			assembly: Point2dAssembly,
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
