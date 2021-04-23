import {Value} from '../model/value';
import {ViewProps} from '../model/view-props';
import {ClassName} from './class-name';
import {bindClassModifier, bindValue, valueToClassName} from './reactive';
import {View} from './view';

interface Config {
	shows: Value<boolean>;
	viewProps: ViewProps;
}

const className = ClassName('pop');

/**
 * @hidden
 */
export class PopupView implements View {
	public readonly element: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		bindClassModifier(config.viewProps, this.element);
		bindValue(
			config.shows,
			valueToClassName(this.element, className(undefined, 'v')),
		);
	}
}
