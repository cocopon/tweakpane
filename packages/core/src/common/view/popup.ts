import {bindValue} from '../model/reactive.js';
import {Value} from '../model/value.js';
import {ViewProps} from '../model/view-props.js';
import {ClassName} from './class-name.js';
import {valueToClassName} from './reactive.js';
import {View} from './view.js';

interface Config {
	shows: Value<boolean>;
	viewProps: ViewProps;
}

const cn = ClassName('pop');

/**
 * @hidden
 */
export class PopupView implements View {
	public readonly element: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(cn());
		config.viewProps.bindClassModifiers(this.element);
		bindValue(config.shows, valueToClassName(this.element, cn(undefined, 'v')));
	}
}
