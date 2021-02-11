import {ClassName} from '../../misc/class-name';
import * as DomUtil from '../../misc/dom-util';
import {InputValue} from '../../model/input-value';
import {Point2d} from '../../model/point-2d';
import {View, ViewConfig} from '../view';
import {InputView} from './input';
import {Point2dPadInputView} from './point-2d-pad';
import {Point2dTextInputView} from './point-2d-text';

interface Config extends ViewConfig {
	padInputView: Point2dPadInputView;
	textInputView: Point2dTextInputView;
}

const className = ClassName('p2dpadtxt', 'input');

/**
 * @hidden
 */
export class Point2dPadTextInputView extends View
	implements InputView<Point2d> {
	private padButtonElem_: HTMLButtonElement;
	private padInputView_: Point2dPadInputView;
	private textInputView_: Point2dTextInputView;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.element.classList.add(className());

		const padWrapperElem = document.createElement('div');
		padWrapperElem.classList.add(className('w'));
		this.element.appendChild(padWrapperElem);

		const buttonElem = document.createElement('button');
		buttonElem.classList.add(className('b'));
		buttonElem.appendChild(DomUtil.createSvgIconElement(document, 'p2dpad'));
		padWrapperElem.appendChild(buttonElem);
		this.padButtonElem_ = buttonElem;

		const padElem = document.createElement('div');
		padElem.classList.add(className('p'));
		padWrapperElem.appendChild(padElem);

		this.padInputView_ = config.padInputView;
		padElem.appendChild(this.padInputView_.element);

		const textElem = document.createElement('div');
		textElem.classList.add(className('t'));
		this.textInputView_ = config.textInputView;
		textElem.appendChild(this.textInputView_.element);
		this.element.appendChild(textElem);
	}

	get value(): InputValue<Point2d> {
		return this.textInputView_.value;
	}

	get padButtonElement(): HTMLButtonElement {
		return this.padButtonElem_;
	}

	public update(): void {
		this.padInputView_.update();
		this.textInputView_.update();
	}
}
