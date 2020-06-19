import {Point2dConstraint} from '../../constraint/point-2d';
import {NumberUtil} from '../../misc/number-util';
import {PointerHandler, PointerHandlerEvents} from '../../misc/pointer-handler';
import {PointerData} from '../../misc/pointer-handler';
import {TypeUtil} from '../../misc/type-util';
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
	private readonly xStep_: number;
	private readonly yStep_: number;

	constructor(document: Document, config: Config) {
		this.onFocusableElementBlur_ = this.onFocusableElementBlur_.bind(this);
		this.onKeyDown_ = this.onKeyDown_.bind(this);
		this.onPadKeyDown_ = this.onPadKeyDown_.bind(this);
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

		const c = this.value.constraint;
		this.xStep_ = UiUtil.getStepForTextInput(
			c instanceof Point2dConstraint ? c.xConstraint : undefined,
		);
		this.yStep_ = UiUtil.getStepForTextInput(
			c instanceof Point2dConstraint ? c.yConstraint : undefined,
		);

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

		this.view.padElement.addEventListener('keydown', this.onPadKeyDown_);

		this.view.element.addEventListener('keydown', this.onKeyDown_);
		this.view.allFocusableElements.forEach((elem) => {
			elem.addEventListener('blur', this.onFocusableElementBlur_);
		});
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

	private onPadKeyDown_(ev: KeyboardEvent): void {
		if (UiUtil.isArrowKey(ev.keyCode)) {
			ev.preventDefault();
		}

		this.value.rawValue = new Point2d(
			this.value.rawValue.x +
				UiUtil.getStepForKey(this.xStep_, UiUtil.getHorizontalStepKeys(ev)),
			this.value.rawValue.y +
				UiUtil.getStepForKey(this.yStep_, UiUtil.getVerticalStepKeys(ev)) *
					(this.invertsY_ ? 1 : -1),
		);
	}

	private onFocusableElementBlur_(e: FocusEvent): void {
		const elem = this.view.element;
		const nextTarget: HTMLElement | null = TypeUtil.forceCast(e.relatedTarget);
		if (!nextTarget || !elem.contains(nextTarget)) {
			this.foldable.expanded = false;
		}
	}

	private onKeyDown_(ev: KeyboardEvent): void {
		if (ev.keyCode === 27) {
			this.foldable.expanded = false;
		}
	}
}
