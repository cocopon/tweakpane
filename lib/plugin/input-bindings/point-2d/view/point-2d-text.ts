import {Value} from '../../../common/model/value';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {NumberTextView} from '../../number/view/number-text';
import {Point2d} from '../model/point-2d';

interface Config {
	value: Value<Point2d>;
	textViews: [NumberTextView, NumberTextView];
}

const className = ClassName('p2dtxt');

/**
 * @hidden
 */
export class Point2dTextView implements ValueView<Point2d> {
	public readonly element: HTMLElement;
	public readonly textViews: [NumberTextView, NumberTextView];
	public readonly value: Value<Point2d>;

	constructor(doc: Document, config: Config) {
		this.textViews = config.textViews;

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		this.textViews.forEach((v) => {
			const axisElem = doc.createElement('div');
			axisElem.classList.add(className('a'));
			axisElem.appendChild(v.element);
			this.element.appendChild(axisElem);
		});

		this.value = config.value;
	}

	public update(): void {
		// Each text view will be connected by ValueSync, so nothing to do here
	}
}
