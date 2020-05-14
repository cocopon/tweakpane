import {Formatter} from '../../formatter/formatter';
import {ClassName} from '../../misc/class-name';
import * as DisposingUtil from '../../misc/disposing-util';
import {PaneError} from '../../misc/pane-error';
import {InputValue} from '../../model/input-value';
import {Point2d} from '../../model/point-2d';
import {View} from '../view';
import {InputView} from './input';

interface Config {
	value: InputValue<Point2d>;
	xFormatter: Formatter<number>;
	yFormatter: Formatter<number>;
}

const COMPONENT_LABELS: [string, string] = ['X', 'Y'];
const className = ClassName('p2dtxt', 'input');

/**
 * @hidden
 */
export class Point2dTextInputView extends View implements InputView<Point2d> {
	public readonly value: InputValue<Point2d>;
	private formatters_: Formatter<number>[];
	private inputElems_: [HTMLInputElement, HTMLInputElement] | null;

	constructor(document: Document, config: Config) {
		super(document);

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

		this.disposable.emitter.on('dispose', () => {
			if (this.inputElems_) {
				this.inputElems_.forEach((elem) => {
					DisposingUtil.disposeElement(elem);
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
