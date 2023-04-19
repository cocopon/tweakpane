import {NumberTextView} from '../../../common/number/view/number-text.js';
import {ClassName} from '../../../common/view/class-name.js';
import {View} from '../../../common/view/view.js';

interface Config {
	textViews: NumberTextView[];
}

const cn = ClassName('pndtxt');

/**
 * @hidden
 */
export class PointNdTextView implements View {
	public readonly element: HTMLElement;
	public readonly textViews: NumberTextView[];

	constructor(doc: Document, config: Config) {
		this.textViews = config.textViews;

		this.element = doc.createElement('div');
		this.element.classList.add(cn());

		this.textViews.forEach((v) => {
			const axisElem = doc.createElement('div');
			axisElem.classList.add(cn('a'));
			axisElem.appendChild(v.element);
			this.element.appendChild(axisElem);
		});
	}
}
