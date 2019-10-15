import {Formatter} from '../../formatter/formatter';
import InputValue from '../../model/input-value';
import Point2d from '../../model/point-2d';
import {Parser} from '../../parser/parser';
import Point2dPadTextInputView from '../../view/input/point-2d-pad-text';
import {InputController} from './input';
import Point2dPadInputController from './point-2d-pad';
import Point2dTextInputController from './point-2d-text';

interface Config {
	parser: Parser<string, number>;
	value: InputValue<Point2d>;
	xFormatter: Formatter<number>;
	yFormatter: Formatter<number>;
}

/**
 * @hidden
 */
export default class Point2dPadTextInputController
	implements InputController<Point2d> {
	public readonly value: InputValue<Point2d>;
	public readonly view: Point2dPadTextInputView;
	private readonly padIc_: Point2dPadInputController;
	private readonly textIc_: Point2dTextInputController;

	constructor(document: Document, config: Config) {
		this.onPadButtonBlur_ = this.onPadButtonBlur_.bind(this);
		this.onPadButtonClick_ = this.onPadButtonClick_.bind(this);

		this.value = config.value;

		this.padIc_ = new Point2dPadInputController(document, {
			value: this.value,
		});

		this.textIc_ = new Point2dTextInputController(document, {
			parser: config.parser,
			value: this.value,
			xFormatter: config.xFormatter,
			yFormatter: config.yFormatter,
		});

		this.view = new Point2dPadTextInputView(document, {
			padInputView: this.padIc_.view,
			textInputView: this.textIc_.view,
		});
		this.view.padButtonElement.addEventListener('blur', this.onPadButtonBlur_);
		this.view.padButtonElement.addEventListener(
			'click',
			this.onPadButtonClick_,
		);
	}

	public dispose(): void {
		this.view.dispose();
	}

	private onPadButtonBlur_(): void {
		this.padIc_.foldable.expanded = false;
	}

	private onPadButtonClick_(): void {
		this.padIc_.foldable.expanded = !this.padIc_.foldable.expanded;
	}
}
