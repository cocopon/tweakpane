import {ViewProps} from '../model/view-props.js';
import {ClassName} from './class-name.js';
import {View} from './view.js';

/**
 * @hidden
 */
interface Config {
	viewName: string;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class PlainView implements View {
	public readonly element: HTMLElement;

	/**
	 * @hidden
	 */
	constructor(doc: Document, config: Config) {
		const cn = ClassName(config.viewName);
		this.element = doc.createElement('div');
		this.element.classList.add(cn());
		config.viewProps.bindClassModifiers(this.element);
	}
}
