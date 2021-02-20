import {disposeElement} from '../../../common/disposing-util';
import {SVG_NS} from '../../../common/dom-util';
import {Formatter} from '../../../common/formatter/formatter';
import {Buffer, BufferedValue} from '../../../common/model/buffered-value';
import {GraphCursor} from '../../../common/model/graph-cursor';
import * as NumberUtil from '../../../common/number-util';
import {PaneError} from '../../../common/pane-error';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {View, ViewConfig} from '../../../common/view/view';

interface Config extends ViewConfig {
	cursor: GraphCursor;
	formatter: Formatter<number>;
	lineCount: number;
	maxValue: number;
	minValue: number;
	value: BufferedValue<number>;
}

const className = ClassName('grl');

/**
 * @hidden
 */
export class GraphLogView extends View implements ValueView<Buffer<number>> {
	public readonly value: BufferedValue<number>;
	private cursor_: GraphCursor;
	private formatter_: Formatter<number>;
	private lineElem_: Element | null;
	private maxValue_: number;
	private minValue_: number;
	private svgElem_: Element | null;
	private tooltipElem_: HTMLElement | null;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.onCursorChange_ = this.onCursorChange_.bind(this);
		this.onValueUpdate_ = this.onValueUpdate_.bind(this);

		this.element.classList.add(className());

		this.formatter_ = config.formatter;
		this.minValue_ = config.minValue;
		this.maxValue_ = config.maxValue;

		this.cursor_ = config.cursor;
		this.cursor_.emitter.on('change', this.onCursorChange_);

		const svgElem = document.createElementNS(SVG_NS, 'svg');
		svgElem.classList.add(className('g'));
		svgElem.style.height = `calc(var(--unit-size) * ${config.lineCount})`;
		this.element.appendChild(svgElem);
		this.svgElem_ = svgElem;

		const lineElem = document.createElementNS(SVG_NS, 'polyline');
		this.svgElem_.appendChild(lineElem);
		this.lineElem_ = lineElem;

		const tooltipElem = document.createElement('div');
		tooltipElem.classList.add(className('t'));
		this.element.appendChild(tooltipElem);
		this.tooltipElem_ = tooltipElem;

		config.value.emitter.on('change', this.onValueUpdate_);
		this.value = config.value;

		this.update();

		config.model.emitter.on('dispose', () => {
			this.lineElem_ = disposeElement(this.lineElem_);
			this.svgElem_ = disposeElement(this.svgElem_);
			this.tooltipElem_ = disposeElement(this.tooltipElem_);
		});
	}

	get graphElement(): Element {
		if (!this.svgElem_) {
			throw PaneError.alreadyDisposed();
		}
		return this.svgElem_;
	}

	public update(): void {
		const tooltipElem = this.tooltipElem_;
		if (!this.lineElem_ || !this.svgElem_ || !tooltipElem) {
			throw PaneError.alreadyDisposed();
		}

		const bounds = this.svgElem_.getBoundingClientRect();

		// Graph
		const maxIndex = this.value.rawValue.length - 1;
		const min = this.minValue_;
		const max = this.maxValue_;
		const points: string[] = [];
		this.value.rawValue.forEach((v, index) => {
			if (v === undefined) {
				return;
			}
			const x = NumberUtil.map(index, 0, maxIndex, 0, bounds.width);
			const y = NumberUtil.map(v, min, max, bounds.height, 0);
			points.push([x, y].join(','));
		});
		this.lineElem_.setAttributeNS(null, 'points', points.join(' '));

		// Cursor
		const value = this.value.rawValue[this.cursor_.index];
		if (value === undefined) {
			tooltipElem.classList.remove(className('t', 'valid'));
			return;
		}
		tooltipElem.classList.add(className('t', 'valid'));

		const tx = NumberUtil.map(this.cursor_.index, 0, maxIndex, 0, bounds.width);
		const ty = NumberUtil.map(value, min, max, bounds.height, 0);
		tooltipElem.style.left = `${tx}px`;
		tooltipElem.style.top = `${ty}px`;
		tooltipElem.textContent = `${this.formatter_.format(value)}`;
	}

	private onValueUpdate_(): void {
		this.update();
	}

	private onCursorChange_(): void {
		this.update();
	}
}
