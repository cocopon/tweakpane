import {createSvgIconElement} from '../../../common/dom-util';
import {Point2d} from '../../../common/model/point-2d';
import {Value} from '../../../common/model/value';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {View, ViewConfig} from '../../../common/view/view';
import {Point2dPadView} from './point-2d-pad';
import {Point2dTextView} from './point-2d-text';

interface Config extends ViewConfig {
	padView: Point2dPadView;
	textView: Point2dTextView;
}

const className = ClassName('p2dpadtxt');

/**
 * @hidden
 */
export class Point2dPadTextView extends View implements ValueView<Point2d> {
	private padButtonElem_: HTMLButtonElement;
	private padView_: Point2dPadView;
	private textView_: Point2dTextView;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.element.classList.add(className());

		const padWrapperElem = document.createElement('div');
		padWrapperElem.classList.add(className('w'));
		this.element.appendChild(padWrapperElem);

		const buttonElem = document.createElement('button');
		buttonElem.classList.add(className('b'));
		buttonElem.appendChild(createSvgIconElement(document, 'p2dpad'));
		padWrapperElem.appendChild(buttonElem);
		this.padButtonElem_ = buttonElem;

		const padElem = document.createElement('div');
		padElem.classList.add(className('p'));
		padWrapperElem.appendChild(padElem);

		this.padView_ = config.padView;
		padElem.appendChild(this.padView_.element);

		const textElem = document.createElement('div');
		textElem.classList.add(className('t'));
		this.textView_ = config.textView;
		textElem.appendChild(this.textView_.element);
		this.element.appendChild(textElem);
	}

	get value(): Value<Point2d> {
		return this.textView_.value;
	}

	get padButtonElement(): HTMLButtonElement {
		return this.padButtonElem_;
	}

	public update(): void {
		this.padView_.update();
		this.textView_.update();
	}
}
