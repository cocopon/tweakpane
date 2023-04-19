import {ViewProps} from '../../../common/model/view-props.js';
import {ClassName} from '../../../common/view/class-name.js';
import {View} from '../../../common/view/view.js';

interface Config {
	viewProps: ViewProps;
}

const cn = ClassName('tbp');

/**
 * @hidden
 */
export class TabPageView implements View {
	public readonly element: HTMLElement;
	public readonly containerElement: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(cn());
		config.viewProps.bindClassModifiers(this.element);

		const containerElem = doc.createElement('div');
		containerElem.classList.add(cn('c'));
		this.element.appendChild(containerElem);
		this.containerElement = containerElem;
	}
}
