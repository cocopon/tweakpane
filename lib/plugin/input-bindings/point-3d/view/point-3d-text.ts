import {Value} from '../../../common/model/value';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {NumberTextView} from '../../number/view/number-text';
import {Point3d} from '../model/point-3d';

interface Config {
	value: Value<Point3d>;
	textViews: [NumberTextView, NumberTextView, NumberTextView];
}

const className = ClassName('p3dtxt');

/**
 * @hidden
 */
export class Point3dTextView implements ValueView<Point3d> {
	public readonly element: HTMLElement;
	public readonly value: Value<Point3d>;
	public readonly textViews: [NumberTextView, NumberTextView, NumberTextView];

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
