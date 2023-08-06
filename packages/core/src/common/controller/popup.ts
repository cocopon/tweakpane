import {Value} from '../model/value.js';
import {createValue} from '../model/values.js';
import {ViewProps} from '../model/view-props.js';
import {PopupView} from '../view/popup.js';
import {Controller} from './controller.js';

interface Config {
	viewProps: ViewProps;
}

export class PopupController implements Controller<PopupView> {
	public readonly shows: Value<boolean> = createValue<boolean>(false);
	public readonly view: PopupView;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: Config) {
		this.viewProps = config.viewProps;
		this.view = new PopupView(doc, {
			shows: this.shows,
			viewProps: this.viewProps,
		});
	}
}
