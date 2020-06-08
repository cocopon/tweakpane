import {NumberUtil} from '../../misc/number-util';
import {PointerHandler, PointerHandlerEvents} from '../../misc/pointer-handler';
import {PointerData} from '../../misc/pointer-handler';
import {Foldable} from '../../model/foldable';
import {InputValue} from '../../model/input-value';
import {Point2d} from '../../model/point-2d';
import {ViewModel} from '../../model/view-model';
import {Point2dPadInputView} from '../../view/input/point-2d-pad';
import * as UiUtil from '../ui-util';
import {InputController} from './input';

interface Config {
	invertsY: boolean;
	value: InputValue<Point2d>;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class Point2dPadInputController implements InputController<Point2d> {
	public readonly viewModel: ViewModel;
	public readonly foldable: Foldable;
	public readonly value: InputValue<Point2d>;
	public readonly view: Point2dPadInputView;
	private readonly ptHandler_: PointerHandler;
	private readonly invertsY_: boolean;
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
		this.invertsY_ = config.invertsY;

		this.viewModel = config.viewModel;
		this.view = new Point2dPadInputView(document, {
			foldable: this.foldable,
			invertsY: this.invertsY_,
			maxValue: this.maxValue_,
			model: this.viewModel,
			value: this.value,
		});

		this.ptHandler_ = new PointerHandler(document, this.view.padElement);
		this.ptHandler_.emitter.on('down', this.onPointerDown_);
		this.ptHandler_.emitter.on('move', this.onPointerMove_);
		this.ptHandler_.emitter.on('up', this.onPointerUp_);
	}

	private handlePointerEvent_(d: PointerData): void {
		const max = this.maxValue_;
		const px = NumberUtil.map(d.px, 0, 1, -max, +max);
		const py = NumberUtil.map(
			this.invertsY_ ? 1 - d.py : d.py,
			0,
			1,
			-max,
			+max,
		);
		this.value.rawValue = new Point2d(px, py);
		this.view.update();
	}

	private onPointerDown_(ev: PointerHandlerEvents['down']): void {
		this.handlePointerEvent_(ev.data);
	}

	private onPointerMove_(ev: PointerHandlerEvents['move']): void {
		this.handlePointerEvent_(ev.data);
	}

	private onPointerUp_(ev: PointerHandlerEvents['up']): void {
		this.handlePointerEvent_(ev.data);
	}
}
