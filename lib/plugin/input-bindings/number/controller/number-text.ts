import {forceCast, isEmpty} from '../../../../misc/type-util';
import {ValueController} from '../../../common/controller/value';
import {Formatter} from '../../../common/converter/formatter';
import {Parser} from '../../../common/converter/parser';
import {Value} from '../../../common/model/value';
import {ValueMap} from '../../../common/model/value-map';
import {getStepForKey, getVerticalStepKeys} from '../../../common/ui';
import {
	PointerHandler,
	PointerHandlerEvent,
} from '../../../common/view/pointer-handler';
import {NumberTextView} from '../view/number-text';

interface Config {
	baseStep: number;
	draggingScale: number;
	formatter: Formatter<number>;
	parser: Parser<number>;
	value: Value<number>;

	arrayPosition?: 'fst' | 'mid' | 'lst';
}

/**
 * @hidden
 */
export class NumberTextController implements ValueController<number> {
	public readonly value: Value<number>;
	public readonly view: NumberTextView;
	private baseStep_: number;
	private parser_: Parser<number>;
	private originRawValue_ = 0;
	private dragging_: Value<number | null>;
	private draggingScale_: number;

	constructor(doc: Document, config: Config) {
		this.onInputChange_ = this.onInputChange_.bind(this);
		this.onInputKeyDown_ = this.onInputKeyDown_.bind(this);
		this.onPointerDown_ = this.onPointerDown_.bind(this);
		this.onPointerMove_ = this.onPointerMove_.bind(this);
		this.onPointerUp_ = this.onPointerUp_.bind(this);

		this.parser_ = config.parser;
		this.value = config.value;
		this.baseStep_ = config.baseStep;
		this.draggingScale_ = config.draggingScale;

		this.dragging_ = new Value<number | null>(null);
		this.view = new NumberTextView(doc, {
			arrayPosition: config.arrayPosition,
			dragging: this.dragging_,
			props: new ValueMap({
				draggingScale: this.draggingScale_,
				formatter: config.formatter,
			}),
			value: this.value,
		});
		this.view.inputElement.addEventListener('change', this.onInputChange_);
		this.view.inputElement.addEventListener('keydown', this.onInputKeyDown_);

		const ph = new PointerHandler(this.view.knobElement);
		ph.emitter.on('down', this.onPointerDown_);
		ph.emitter.on('move', this.onPointerMove_);
		ph.emitter.on('up', this.onPointerUp_);
	}

	private onInputChange_(e: Event): void {
		const inputElem: HTMLInputElement = forceCast(e.currentTarget);
		const value = inputElem.value;

		const parsedValue = this.parser_(value);
		if (!isEmpty(parsedValue)) {
			this.value.rawValue = parsedValue;
		}
		this.view.update();
	}

	private onInputKeyDown_(e: KeyboardEvent): void {
		const step = getStepForKey(this.baseStep_, getVerticalStepKeys(e));
		if (step !== 0) {
			this.value.rawValue += step;
			this.view.update();
		}
	}

	private onPointerDown_() {
		this.originRawValue_ = this.value.rawValue;
		this.dragging_.rawValue = 0;
	}

	private onPointerMove_(ev: PointerHandlerEvent) {
		if (!ev.data.point) {
			return;
		}

		const dx = ev.data.point.x - ev.data.bounds.width / 2;
		this.value.rawValue = this.originRawValue_ + dx * this.draggingScale_;
		this.dragging_.rawValue = this.value.rawValue - this.originRawValue_;
	}

	private onPointerUp_() {
		this.dragging_.rawValue = null;
	}
}
