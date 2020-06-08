import {Formatter} from '../../formatter/formatter';
import {NumberUtil} from '../../misc/number-util';
import {GraphCursor} from '../../model/graph-cursor';
import {MonitorValue} from '../../model/monitor-value';
import {ViewModel} from '../../model/view-model';
import {GraphMonitorView} from '../../view/monitor/graph';
import {MonitorController} from './monitor';

interface Config {
	formatter: Formatter<number>;
	maxValue: number;
	minValue: number;
	value: MonitorValue<number>;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class GraphMonitorController implements MonitorController<number> {
	public readonly viewModel: ViewModel;
	public readonly value: MonitorValue<number>;
	public readonly view: GraphMonitorView;
	private cursor_: GraphCursor;

	constructor(document: Document, config: Config) {
		this.onGraphMouseLeave_ = this.onGraphMouseLeave_.bind(this);
		this.onGraphMouseMove_ = this.onGraphMouseMove_.bind(this);

		this.value = config.value;
		this.cursor_ = new GraphCursor();

		this.viewModel = config.viewModel;
		this.view = new GraphMonitorView(document, {
			cursor: this.cursor_,
			formatter: config.formatter,
			maxValue: config.maxValue,
			minValue: config.minValue,
			model: this.viewModel,
			value: this.value,
		});
		this.view.graphElement.addEventListener(
			'mouseleave',
			this.onGraphMouseLeave_,
		);
		this.view.graphElement.addEventListener(
			'mousemove',
			this.onGraphMouseMove_,
		);
	}

	private onGraphMouseLeave_(): void {
		this.cursor_.index = -1;
	}

	private onGraphMouseMove_(e: MouseEvent): void {
		const bounds = this.view.graphElement.getBoundingClientRect();
		const x = e.offsetX;
		this.cursor_.index = Math.floor(
			NumberUtil.map(x, 0, bounds.width, 0, this.value.totalCount),
		);
	}
}
