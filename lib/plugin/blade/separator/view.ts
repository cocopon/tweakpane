import {ClassName} from '../../common/view/class-name';
import {View} from '../../common/view/view';

const className = ClassName('spr');

/**
 * @hidden
 */
export class SeparatorView implements View {
	public readonly element: HTMLElement;

	constructor(doc: Document) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const hrElem = doc.createElement('hr');
		hrElem.classList.add(className('r'));
		this.element.appendChild(hrElem);
	}
}
