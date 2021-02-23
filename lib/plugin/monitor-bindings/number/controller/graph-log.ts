import {ValueController} from '../../../common/controller/value';
import {Formatter} from '../../../common/converter/formatter';
import {Buffer, BufferedValue} from '../../../common/model/buffered-value';
import {GraphCursor} from '../../../common/model/graph-cursor';
import {mapRange} from '../../../common/number-util';
import {GraphLogView} from '../view/graph-log';

interface Config {
	formatter: Formatter<number>;
	lineCount: number;
	maxValue: number;
	minValue: number;
	value: BufferedValue<number>;
}

/**
 * @hidden
 */
export class GraphLogController implements ValueController<Buffer<number>> {
	public readonly value: BufferedValue<number>;
	public readonly view: GraphLogView;
	private cursor_: GraphCursor;

	constructor(doc: Document, config: Config) {
		this.onGraphMouseLeave_ = this.onGraphMouseLeave_.bind(this);
		this.onGraphMouseMove_ = this.onGraphMouseMove_.bind(this);

		this.value = config.value;
		this.cursor_ = new GraphCursor();

		this.view = new GraphLogView(doc, {
			cursor: this.cursor_,
			formatter: config.formatter,
			lineCount: config.lineCount,
			maxValue: config.maxValue,
			minValue: config.minValue,
			value: this.value,
		});
		this.view.element.addEventListener('mouseleave', this.onGraphMouseLeave_);
		this.view.element.addEventListener('mousemove', this.onGraphMouseMove_);
	}

	private onGraphMouseLeave_(): void {
		this.cursor_.index = -1;
	}

	private onGraphMouseMove_(e: MouseEvent): void {
		const bounds = this.view.graphElement.getBoundingClientRect();
		const x = e.offsetX;
		this.cursor_.index = Math.floor(
			mapRange(x, 0, bounds.width, 0, this.value.rawValue.length),
		);
	}
}
