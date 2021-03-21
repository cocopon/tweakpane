import {Value} from '../../../common/model/value';
import {ClassName} from '../../../common/view/class-name';
import {View} from '../../../common/view/view';
import {NumberTextView} from '../../number/view/number-text';

interface Config<PointNd> {
	value: Value<PointNd>;
	textViews: NumberTextView[];
}

const className = ClassName('p2dtxt');

/**
 * @hidden
 */
export class PointNdTextView<PointNd> implements View {
	public readonly element: HTMLElement;
	public readonly textViews: NumberTextView[];
	public readonly value: Value<PointNd>;

	constructor(doc: Document, config: Config<PointNd>) {
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
