import {NumberUtil} from '../../misc/number-util';
import {PointerHandler} from '../../misc/pointer-handler';
import {PointerData} from '../../misc/pointer-handler';
import {Disposable} from '../../model/disposable';
import {Foldable} from '../../model/foldable';
import {InputValue} from '../../model/input-value';
import {Point2d} from '../../model/point-2d';
import {Point2dPadInputView} from '../../view/input/point-2d-pad';
import {ControllerConfig} from '../controller';
import * as UiUtil from '../ui-util';
import {InputController} from './input';

interface Config extends ControllerConfig {
	value: InputValue<Point2d>;
}

/**
 * @hidden
 */
export class Point2dPadInputController implements InputController<Point2d> {
	public readonly disposable: Disposable;
	public readonly foldable: Foldable;
	public readonly value: InputValue<Point2d>;
	public readonly view: Point2dPadInputView;
	private readonly ptHandler_: PointerHandler;
	private readonly maxValue_: number;

	constructor(document: Document, config: Config) {
		this.onPointerDown_ = this.onPointerDown_.bind(this);
		this.onPointerMove_ = this.onPointerMove_.bind(this);
		this.onPointerUp_ = this.onPointerUp_.bind(this);

		this.value = config.value;
		this.foldable = new Foldable();

		this.maxValue_ = UiUtil.getSuitableMaxValueForPoint2dPad(
			this.value.constraint,
			this.value.rawValue,
		);

		this.disposable = config.disposable;
		this.view = new Point2dPadInputView(document, {
			disposable: this.disposable,
			foldable: this.foldable,
			maxValue: this.maxValue_,
			value: this.value,
		});

		this.ptHandler_ = new PointerHandler(document, this.view.padElement);
		this.ptHandler_.emitter.on('down', this.onPointerDown_);
		this.ptHandler_.emitter.on('move', this.onPointerMove_);
		this.ptHandler_.emitter.on('up', this.onPointerUp_);
	}

	private handlePointerEvent_(d: PointerData): void {
		const max = this.maxValue_;
		this.value.rawValue = new Point2d(
			NumberUtil.map(d.px, 0, 1, -max, +max),
			NumberUtil.map(d.py, 0, 1, -max, +max),
		);
		this.view.update();
	}

	private onPointerDown_(d: PointerData): void {
		this.handlePointerEvent_(d);
	}

	private onPointerMove_(d: PointerData): void {
		this.handlePointerEvent_(d);
	}

	private onPointerUp_(d: PointerData): void {
		this.handlePointerEvent_(d);
	}
}
