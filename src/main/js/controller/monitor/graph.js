// @flow

import NumberUtil from '../../misc/number-util';
import GraphCursor from '../../model/graph-cursor';
import MonitorValue from '../../model/monitor-value';
import GraphMonitorView from '../../view/monitor/graph';

import type {Formatter} from '../../formatter/formatter';
import type {MonitorController} from './monitor';

type Config = {
	formatter: Formatter<number>,
	maxValue: number,
	minValue: number,
	value: MonitorValue<number>,
};

export default class GraphMonitorController
	implements MonitorController<number> {
	+value: MonitorValue<number>;
	+view: GraphMonitorView;
	cursor_: GraphCursor;

	constructor(document: Document, config: Config) {
		(this: any).onGraphMouseLeave_ = this.onGraphMouseLeave_.bind(this);
		(this: any).onGraphMouseMove_ = this.onGraphMouseMove_.bind(this);

		this.value = config.value;
		this.cursor_ = new GraphCursor();

		this.view = new GraphMonitorView(document, {
			cursor: this.cursor_,
			formatter: config.formatter,
			maxValue: config.maxValue,
			minValue: config.minValue,
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

	onGraphMouseLeave_(): void {
		this.cursor_.index = -1;
	}

	onGraphMouseMove_(e: MouseEvent): void {
		const bounds = this.view.graphElement.getBoundingClientRect();
		const x = e.offsetX;
		this.cursor_.index = Math.floor(
			NumberUtil.map(x, 0, bounds.width, 0, this.value.totalCount),
		);
	}
}
