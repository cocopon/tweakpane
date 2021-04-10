import {ViewProps} from '../model/view-props';
import {ClassName} from './class-name';
import {bindClassModifier} from './reactive';
import {View} from './view';

interface Config {
	viewName: string;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class PlainView implements View {
	public readonly element: HTMLElement;

	constructor(doc: Document, config: Config) {
		const className = ClassName(config.viewName);
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		bindClassModifier(config.viewProps, this.element);
	}
}
