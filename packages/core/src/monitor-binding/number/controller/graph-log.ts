import {Controller} from '../../../common/controller/controller';
import {Formatter} from '../../../common/converter/formatter';
import {supportsTouch} from '../../../common/dom-util';
import {BufferedValue} from '../../../common/model/buffered-value';
import {ViewProps} from '../../../common/model/view-props';
import {mapRange} from '../../../common/number-util';
import {
	PointerHandler,
	PointerHandlerEvent,
} from '../../../common/view/pointer-handler';
import {GraphCursor} from '../model/graph-cursor';
import {GraphLogView} from '../view/graph-log';

interface Config {
	formatter: Formatter<number>;
	lineCount: number;
	maxValue: number;
	minValue: number;
	value: BufferedValue<number>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class GraphLogController implements Controller<GraphLogView> {
	public readonly value: BufferedValue<number>;
	public readonly view: GraphLogView;
	public readonly viewProps: ViewProps;
	private cursor_: GraphCursor;

	constructor(doc: Document, config: Config) {
		this.onGraphMouseMove_ = this.onGraphMouseMove_.bind(this);
		this.onGraphMouseLeave_ = this.onGraphMouseLeave_.bind(this);
		this.onGraphPointerDown_ = this.onGraphPointerDown_.bind(this);
		this.onGraphPointerMove_ = this.onGraphPointerMove_.bind(this);
		this.onGraphPointerUp_ = this.onGraphPointerUp_.bind(this);

		this.value = config.value;
		this.viewProps = config.viewProps;
		this.cursor_ = new GraphCursor();

		this.view = new GraphLogView(doc, {
			cursor: this.cursor_,
			formatter: config.formatter,
			lineCount: config.lineCount,
			maxValue: config.maxValue,
			minValue: config.minValue,
			value: this.value,
			viewProps: this.viewProps,
		});

		if (!supportsTouch(doc)) {
			this.view.element.addEventListener('mousemove', this.onGraphMouseMove_);
			this.view.element.addEventListener('mouseleave', this.onGraphMouseLeave_);
		} else {
			const ph = new PointerHandler(this.view.element);
			ph.emitter.on('down', this.onGraphPointerDown_);
			ph.emitter.on('move', this.onGraphPointerMove_);
			ph.emitter.on('up', this.onGraphPointerUp_);
		}
	}

	private onGraphMouseLeave_(): void {
		this.cursor_.index = -1;
	}

	private onGraphMouseMove_(ev: MouseEvent): void {
		const bounds = this.view.element.getBoundingClientRect();
		this.cursor_.index = Math.floor(
			mapRange(ev.offsetX, 0, bounds.width, 0, this.value.rawValue.length),
		);
	}

	private onGraphPointerDown_(ev: PointerHandlerEvent): void {
		this.onGraphPointerMove_(ev);
	}

	private onGraphPointerMove_(ev: PointerHandlerEvent): void {
		if (!ev.data.point) {
			this.cursor_.index = -1;
			return;
		}

		this.cursor_.index = Math.floor(
			mapRange(
				ev.data.point.x,
				0,
				ev.data.bounds.width,
				0,
				this.value.rawValue.length,
			),
		);
	}

	private onGraphPointerUp_(): void {
		this.cursor_.index = -1;
	}
}
