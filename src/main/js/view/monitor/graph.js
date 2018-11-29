// @flow

import ClassName from '../../misc/class-name';
import NumberUtil from '../../misc/number-util';
import GraphCursor from '../../model/graph-cursor';
import MonitorValue from '../../model/monitor-value';
import View from '../view';

import type {Formatter} from '../../formatter/formatter';
import type {MonitorView} from './monitor';

const SVG_NS: string = 'http://www.w3.org/2000/svg';

type Config = {
	cursor: GraphCursor,
	formatter: Formatter<number>,
	maxValue: number,
	minValue: number,
	value: MonitorValue<number>,
};

const className = ClassName('grp', 'monitor');

export default class GraphMonitorView extends View implements MonitorView<number> {
	+value: MonitorValue<number>;
	cursor_: GraphCursor;
	formatter_: Formatter<number>;
	lineElem_: Element;
	maxValue_: number;
	minValue_: number;
	svgElem_: Element;
	tooltipElem_: HTMLElement;

	constructor(document: Document, config: Config) {
		super(document);

		(this: any).onCursorChange_ = this.onCursorChange_.bind(this);
		(this: any).onValueUpdate_ = this.onValueUpdate_.bind(this);

		this.element.classList.add(className());

		this.formatter_ = config.formatter;
		this.minValue_ = config.minValue;
		this.maxValue_ = config.maxValue;

		this.cursor_ = config.cursor;
		this.cursor_.emitter.on('change', this.onCursorChange_);

		const svgElem = document.createElementNS(SVG_NS, 'svg');
		svgElem.classList.add(className('g'));
		this.element.appendChild(svgElem);
		this.svgElem_ = svgElem;

		const lineElem = document.createElementNS(SVG_NS, 'polyline');
		this.svgElem_.appendChild(lineElem);
		this.lineElem_ = lineElem;

		const tooltipElem = document.createElement('div');
		tooltipElem.classList.add(className('t'));
		this.element.appendChild(tooltipElem);
		this.tooltipElem_ = tooltipElem;

		config.value.emitter.on('update', this.onValueUpdate_);
		this.value = config.value;

		this.update();
	}

	get graphElement(): Element {
		return this.svgElem_;
	}

	update(): void {
		const bounds = this.svgElem_.getBoundingClientRect();

		// Graph
		const maxIndex = this.value.totalCount - 1;
		const min = this.minValue_;
		const max = this.maxValue_;
		this.lineElem_.setAttributeNS(
			null,
			'points',
			this.value.rawValues.map((value, index) => {
				const x = NumberUtil.map(index, 0, maxIndex, 0, bounds.width);
				const y = NumberUtil.map(value, min, max, bounds.height, 0);
				return [x, y].join(',');
			}).join(' '),
		);

		// Cursor
		const tooltipElem = this.tooltipElem_;
		const value = this.value.rawValues[this.cursor_.index];
		if (value === undefined) {
			tooltipElem.classList.remove(className('t', 'valid'));
			return;
		}
		tooltipElem.classList.add(className('t', 'valid'));

		const tx = NumberUtil.map(
			this.cursor_.index,
			0, maxIndex,
			0, bounds.width,
		);
		const ty = NumberUtil.map(
			value,
			min, max,
			bounds.height, 0,
		);
		tooltipElem.style.left = `${tx}px`;
		tooltipElem.style.top = `${ty}px`;
		this.tooltipElem_.textContent = `${this.formatter_.format(value)}`;
	}

	onValueUpdate_(): void {
		this.update();
	}

	onCursorChange_(): void {
		this.update();
	}
}
