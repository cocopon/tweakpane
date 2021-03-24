import {ClassName} from '../../common/view/class-name';
import {bindViewProps, View, ViewProps} from '../../common/view/view';

const className = ClassName('spr');

interface Config {
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class SeparatorView implements View {
	public readonly element: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		bindViewProps(config.viewProps, this.element);

		const hrElem = doc.createElement('hr');
		hrElem.classList.add(className('r'));
		this.element.appendChild(hrElem);
	}
}
