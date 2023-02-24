import {ViewProps} from '../model/view-props';
import {ClassName} from './class-name';
import {View} from './view';

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
