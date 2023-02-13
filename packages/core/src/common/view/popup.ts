import {bindValue} from '../model/reactive';
import {Value} from '../model/value';
import {ViewProps} from '../model/view-props';
import {ClassName} from './class-name';
import {valueToClassName} from './reactive';
import {View} from './view';

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
