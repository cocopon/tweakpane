import {bindFoldable, Foldable} from '../../../blade/common/model/foldable.js';
import {PopupController} from '../../../common/controller/popup.js';
import {ValueController} from '../../../common/controller/value.js';
import {Parser} from '../../../common/converter/parser.js';
import {findNextTarget, supportsTouch} from '../../../common/dom-util.js';
import {Value} from '../../../common/model/value.js';
import {ValueMap} from '../../../common/model/value-map.js';
import {connectValues} from '../../../common/model/value-sync.js';
import {createValue} from '../../../common/model/values.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {PickerLayout} from '../../../common/params.js';
import {PointAxis} from '../../../common/point-nd/point-axis.js';
import {forceCast, Tuple2} from '../../../misc/type-util.js';
import {PointNdTextController} from '../../common/controller/point-nd-text.js';
import {Point2d, Point2dAssembly} from '../model/point-2d.js';
import {Point2dView} from '../view/point-2d.js';
import {Point2dPickerController} from './point-2d-picker.js';

interface Config {
	axes: Tuple2<PointAxis>;
	expanded: boolean;
	invertsY: boolean;
	max: number;
	parser: Parser<number>;
	pickerLayout: PickerLayout;
	value: Value<Point2d>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class Point2dController
	implements ValueController<Point2d, Point2dView>
{
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
			layout: config.pickerLayout,
			props: new ValueMap({
				invertsY: createValue(config.invertsY),
				max: createValue(config.max),
				xKeyScale: config.axes[0].textProps.value('keyScale'),
				yKeyScale: config.axes[1].textProps.value('keyScale'),
			}),
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
				forward: (p) => p,
				backward: (_, s) => s,
			});
		} else if (this.view.pickerElement) {
			this.view.pickerElement.appendChild(this.pickerC_.view.element);

			bindFoldable(this.foldable_, this.view.pickerElement);
		}
	}

	get textController(): PointNdTextController<Point2d> {
		return this.textC_;
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
