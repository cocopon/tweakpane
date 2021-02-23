import {Formatter} from '../../../common/converter/formatter';
import {Value} from '../../../common/model/value';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {Point3d} from '../model/point-3d';

interface Config {
	value: Value<Point3d>;
	formatters: [Formatter<number>, Formatter<number>, Formatter<number>];
}

const className = ClassName('p3dtxt');

/**
 * @hidden
 */
export class Point3dTextView implements ValueView<Point3d> {
	public readonly element: HTMLElement;
	public readonly value: Value<Point3d>;
	private formatters_: [
		Formatter<number>,
		Formatter<number>,
		Formatter<number>,
	];
	private inputElems_: [HTMLInputElement, HTMLInputElement, HTMLInputElement];

	constructor(doc: Document, config: Config) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.formatters_ = config.formatters;

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const inputElems = [0, 1, 2].map(() => {
			const inputElem = doc.createElement('input');
			inputElem.classList.add(className('i'));
			inputElem.type = 'text';
			return inputElem;
		});
		[0, 1, 2].forEach((_, index) => {
			const elem = doc.createElement('div');
			elem.classList.add(className('w'));
			elem.appendChild(inputElems[index]);
			this.element.appendChild(elem);
		});

		this.inputElems_ = [inputElems[0], inputElems[1], inputElems[2]];

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.update();
	}

	get inputElements(): [HTMLInputElement, HTMLInputElement, HTMLInputElement] {
		return this.inputElems_;
	}

	public update(): void {
		const comps = this.value.rawValue.getComponents();
		comps.forEach((comp, index) => {
			const inputElem = this.inputElems_[index];
			inputElem.value = this.formatters_[index].format(comp);
		});
	}

	private onValueChange_(): void {
		this.update();
	}
}
