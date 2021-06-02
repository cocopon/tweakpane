import {bindFoldable, Foldable} from '../../../blade/common/model/foldable';
import {Constraint} from '../../../common/constraint/constraint';
import {Controller} from '../../../common/controller/controller';
import {PopupController} from '../../../common/controller/popup';
import {Parser} from '../../../common/converter/parser';
import {findNextTarget, supportsTouch} from '../../../common/dom-util';
import {Value} from '../../../common/model/value';
import {connectValues} from '../../../common/model/value-sync';
import {ViewProps} from '../../../common/model/view-props';
import {NumberTextProps} from '../../../common/number/view/number-text';
import {PickerLayout} from '../../../common/params';
import {forceCast} from '../../../misc/type-util';
import {PointNdTextController} from '../../common/controller/point-nd-text';
import {Point2d, Point2dAssembly} from '../model/point-2d';
import {Point2dView} from '../view/point-2d';
import {Point2dPickerController} from './point-2d-picker';

interface Axis {
	baseStep: number;
	constraint: Constraint<number> | undefined;
	textProps: NumberTextProps;
}

interface Config {
	axes: [Axis, Axis];
	expanded: boolean;
	invertsY: boolean;
	maxValue: number;
	parser: Parser<number>;
	pickerLayout: PickerLayout;
	value: Value<Point2d>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class Point2dController implements Controller<Point2dView> {
	public readonly value: Value<Point2d>;
	public readonly view: Point2dView;
	public readonly viewProps: ViewProps;
	private readonly popC_: PopupController | null;
	private readonly pickerC_: Point2dPickerController;
	private readonly textC_: PointNdTextController<Point2d>;
	private readonly foldable_: Foldable;

	constructor(doc: Document, config: Config) {
		this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this);
		this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this);
		this.onPadButtonBlur_ = this.onPadButtonBlur_.bind(this);
		this.onPadButtonClick_ = this.onPadButtonClick_.bind(this);

		this.value = config.value;
		this.viewProps = config.viewProps;

		this.foldable_ = Foldable.create(config.expanded);

		this.popC_ =
			config.pickerLayout === 'popup'
				? new PopupController(doc, {
						viewProps: this.viewProps,
				  })
				: null;

		const padC = new Point2dPickerController(doc, {
			baseSteps: [config.axes[0].baseStep, config.axes[1].baseStep],
			invertsY: config.invertsY,
			layout: config.pickerLayout,
			maxValue: config.maxValue,
			value: this.value,
			viewProps: this.viewProps,
		});
		padC.view.allFocusableElements.forEach((elem) => {
			elem.addEventListener('blur', this.onPopupChildBlur_);
			elem.addEventListener('keydown', this.onPopupChildKeydown_);
		});
		this.pickerC_ = padC;

		this.textC_ = new PointNdTextController(doc, {
			assembly: Point2dAssembly,
			axes: config.axes,
			parser: config.parser,
			value: this.value,
			viewProps: this.viewProps,
		});

		this.view = new Point2dView(doc, {
			expanded: this.foldable_.value('expanded'),
			pickerLayout: config.pickerLayout,
			viewProps: this.viewProps,
		});
		this.view.textElement.appendChild(this.textC_.view.element);
		this.view.buttonElement?.addEventListener('blur', this.onPadButtonBlur_);
		this.view.buttonElement?.addEventListener('click', this.onPadButtonClick_);

		if (this.popC_) {
			this.view.element.appendChild(this.popC_.view.element);
			this.popC_.view.element.appendChild(this.pickerC_.view.element);

			connectValues({
				primary: this.foldable_.value('expanded'),
				secondary: this.popC_.shows,
				forward: (p) => p.rawValue,
				backward: (_, s) => s.rawValue,
			});
		} else if (this.view.pickerElement) {
			this.view.pickerElement.appendChild(this.pickerC_.view.element);

			bindFoldable(this.foldable_, this.view.pickerElement);
		}
	}

	private onPadButtonBlur_(e: FocusEvent) {
		if (!this.popC_) {
			return;
		}

		const elem = this.view.element;
		const nextTarget: HTMLElement | null = forceCast(e.relatedTarget);
		if (!nextTarget || !elem.contains(nextTarget)) {
			this.popC_.shows.rawValue = false;
		}
	}

	private onPadButtonClick_(): void {
		this.foldable_.set('expanded', !this.foldable_.get('expanded'));
		if (this.foldable_.get('expanded')) {
			this.pickerC_.view.allFocusableElements[0].focus();
		}
	}

	private onPopupChildBlur_(ev: FocusEvent): void {
		if (!this.popC_) {
			return;
		}

		const elem = this.popC_.view.element;
		const nextTarget = findNextTarget(ev);
		if (nextTarget && elem.contains(nextTarget)) {
			// Next target is in the popup
			return;
		}
		if (
			nextTarget &&
			nextTarget === this.view.buttonElement &&
			!supportsTouch(elem.ownerDocument)
		) {
			// Next target is the trigger button
			return;
		}

		this.popC_.shows.rawValue = false;
	}

	private onPopupChildKeydown_(ev: KeyboardEvent): void {
		if (this.popC_) {
			if (ev.key === 'Escape') {
				this.popC_.shows.rawValue = false;
			}
		} else if (this.view.pickerElement) {
			if (ev.key === 'Escape') {
				this.view.buttonElement.focus();
			}
		}
	}
}
