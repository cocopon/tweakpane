import {Point2d} from '../../../common/model/point-2d';
import {Value} from '../../../common/model/value';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {Formatter} from '../../../common/writer/formatter';

interface Config {
	value: Value<Point2d>;
	xFormatter: Formatter<number>;
	yFormatter: Formatter<number>;
}

const COMPONENT_LABELS: [string, string] = ['X', 'Y'];
const className = ClassName('p2dtxt');

/**
 * @hidden
 */
export class Point2dTextView implements ValueView<Point2d> {
	public readonly element: HTMLElement;
	public readonly value: Value<Point2d>;
	private formatters_: Formatter<number>[];
	private inputElems_: [HTMLInputElement, HTMLInputElement];

	constructor(doc: Document, config: Config) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.formatters_ = [config.xFormatter, config.yFormatter];

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const inputElems = COMPONENT_LABELS.map(() => {
			const inputElem = doc.createElement('input');
			inputElem.classList.add(className('i'));
			inputElem.type = 'text';
			return inputElem;
		});
		COMPONENT_LABELS.forEach((_, index) => {
			const elem = doc.createElement('div');
			elem.classList.add(className('w'));
			elem.appendChild(inputElems[index]);
			this.element.appendChild(elem);
		});

		this.inputElems_ = [inputElems[0], inputElems[1]];

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.update();
	}

	get inputElements(): [HTMLInputElement, HTMLInputElement] {
		return this.inputElems_;
	}

	public update(): void {
		const xyComps = this.value.rawValue.getComponents();
		xyComps.forEach((comp, index) => {
			const inputElem = this.inputElems_[index];
			inputElem.value = this.formatters_[index].format(comp);
		});
	}

	private onValueChange_(): void {
		this.update();
	}
}
