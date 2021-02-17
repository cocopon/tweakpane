import {Formatter} from '../../formatter/formatter';
import {TypeUtil} from '../../misc/type-util';
import {InputValue} from '../../model/input-value';
import {Point2d} from '../../model/point-2d';
import {ViewModel} from '../../model/view-model';
import {Parser} from '../../parser/parser';
import {Point2dPadTextInputView} from '../../view/input/point-2d-pad-text';
import {InputController} from './input';
import {Point2dPadInputController} from './point-2d-pad';
import {Point2dTextInputController} from './point-2d-text';

interface Config {
	invertsY: boolean;
	parser: Parser<string, number>;
	value: InputValue<Point2d>;
	viewModel: ViewModel;
	xBaseStep: number;
	xFormatter: Formatter<number>;
	yBaseStep: number;
	yFormatter: Formatter<number>;
}

/**
 * @hidden
 */
export class Point2dPadTextInputController implements InputController<Point2d> {
	public readonly viewModel: ViewModel;
	public readonly value: InputValue<Point2d>;
	public readonly view: Point2dPadTextInputView;
	private readonly padIc_: Point2dPadInputController;
	private readonly textIc_: Point2dTextInputController;

	constructor(document: Document, config: Config) {
		this.onPadButtonBlur_ = this.onPadButtonBlur_.bind(this);
		this.onPadButtonClick_ = this.onPadButtonClick_.bind(this);

		this.value = config.value;

		this.viewModel = config.viewModel;
		this.padIc_ = new Point2dPadInputController(document, {
			invertsY: config.invertsY,
			value: this.value,
			viewModel: this.viewModel,
			xBaseStep: config.xBaseStep,
			yBaseStep: config.yBaseStep,
		});

		this.textIc_ = new Point2dTextInputController(document, {
			parser: config.parser,
			value: this.value,
			viewModel: this.viewModel,
			xBaseStep: config.xBaseStep,
			xFormatter: config.xFormatter,
			yBaseStep: config.yBaseStep,
			yFormatter: config.yFormatter,
		});

		this.view = new Point2dPadTextInputView(document, {
			model: this.viewModel,
			padInputView: this.padIc_.view,
			textInputView: this.textIc_.view,
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
		const nextTarget: HTMLElement | null = TypeUtil.forceCast(e.relatedTarget);
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
