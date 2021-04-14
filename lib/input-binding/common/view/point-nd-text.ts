import {NumberTextView} from '../../../common/number/view/number-text';
import {ClassName} from '../../../common/view/class-name';
import {View} from '../../../common/view/view';

interface Config {
	textViews: NumberTextView[];
}

const className = ClassName('pndtxt');

/**
 * @hidden
 */
export class PointNdTextView implements View {
	public readonly element: HTMLElement;
	public readonly textViews: NumberTextView[];

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
	}
}
