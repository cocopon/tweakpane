import {disposeElement} from '../../../common/disposing-util';
import {Point2d} from '../../../common/model/point-2d';
import {Value} from '../../../common/model/value';
import {PaneError} from '../../../common/pane-error';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {View, ViewConfig} from '../../../common/view/view';
import {Formatter} from '../../../common/writer/formatter';

interface Config extends ViewConfig {
	value: Value<Point2d>;
	xFormatter: Formatter<number>;
	yFormatter: Formatter<number>;
}

const COMPONENT_LABELS: [string, string] = ['X', 'Y'];
const className = ClassName('p2dtxt');

/**
 * @hidden
 */
export class Point2dTextView extends View implements ValueView<Point2d> {
	public readonly value: Value<Point2d>;
	private formatters_: Formatter<number>[];
	private inputElems_: [HTMLInputElement, HTMLInputElement] | null;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.onValueChange_ = this.onValueChange_.bind(this);

		this.formatters_ = [config.xFormatter, config.yFormatter];

		this.element.classList.add(className());

		const inputElems = COMPONENT_LABELS.map(() => {
			const inputElem = document.createElement('input');
			inputElem.classList.add(className('i'));
			inputElem.type = 'text';
			return inputElem;
		});
		COMPONENT_LABELS.forEach((_, index) => {
			const elem = document.createElement('div');
			elem.classList.add(className('w'));
			elem.appendChild(inputElems[index]);
			this.element.appendChild(elem);
		});

		this.inputElems_ = [inputElems[0], inputElems[1]];

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.update();

		config.model.emitter.on('dispose', () => {
			if (this.inputElems_) {
				this.inputElems_.forEach((elem) => {
					disposeElement(elem);
				});
				this.inputElems_ = null;
			}
		});
	}

	get inputElements(): [HTMLInputElement, HTMLInputElement] {
		if (!this.inputElems_) {
			throw PaneError.alreadyDisposed();
		}
		return this.inputElems_;
	}

	public update(): void {
		const inputElems = this.inputElems_;
		if (!inputElems) {
			throw PaneError.alreadyDisposed();
		}

		const xyComps = this.value.rawValue.getComponents();

		xyComps.forEach((comp, index) => {
			const inputElem = inputElems[index];
			inputElem.value = this.formatters_[index].format(comp);
		});
	}

	private onValueChange_(): void {
		this.update();
	}
}
