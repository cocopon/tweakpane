import {forceCast} from '../../../../misc/type-util';
import {ValueController} from '../../../common/controller/value';
import {Formatter} from '../../../common/formatter/formatter';
import {Point2d} from '../../../common/model/point-2d';
import {Value} from '../../../common/model/value';
import {ViewModel} from '../../../common/model/view-model';
import {Parser} from '../../../common/parser/parser';
import {Point2dPadTextView} from '../view/point-2d-pad-text';
import {Point2dPadController} from './point-2d-pad';
import {Point2dTextController} from './point-2d-text';

interface Config {
	invertsY: boolean;
	maxValue: number;
	parser: Parser<string, number>;
	value: Value<Point2d>;
	viewModel: ViewModel;
	xBaseStep: number;
	xFormatter: Formatter<number>;
	yBaseStep: number;
	yFormatter: Formatter<number>;
}

/**
 * @hidden
 */
export class Point2dPadTextController implements ValueController<Point2d> {
	public readonly viewModel: ViewModel;
	public readonly value: Value<Point2d>;
	public readonly view: Point2dPadTextView;
	private readonly padIc_: Point2dPadController;
	private readonly textIc_: Point2dTextController;

	constructor(document: Document, config: Config) {
		this.onPadButtonBlur_ = this.onPadButtonBlur_.bind(this);
		this.onPadButtonClick_ = this.onPadButtonClick_.bind(this);

		this.value = config.value;

		this.viewModel = config.viewModel;
		this.padIc_ = new Point2dPadController(document, {
			invertsY: config.invertsY,
			maxValue: config.maxValue,
			value: this.value,
			viewModel: this.viewModel,
			xBaseStep: config.xBaseStep,
			yBaseStep: config.yBaseStep,
		});

		this.textIc_ = new Point2dTextController(document, {
			parser: config.parser,
			value: this.value,
			viewModel: this.viewModel,
			xBaseStep: config.xBaseStep,
			xFormatter: config.xFormatter,
			yBaseStep: config.yBaseStep,
			yFormatter: config.yFormatter,
		});

		this.view = new Point2dPadTextView(document, {
			model: this.viewModel,
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
