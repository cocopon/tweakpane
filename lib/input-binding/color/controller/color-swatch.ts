import {Controller} from '../../../common/controller/controller';
import {Value} from '../../../common/model/value';
import {ViewProps} from '../../../common/model/view-props';
import {Color} from '../model/color';
import {ColorSwatchView} from '../view/color-swatch';

interface Config {
	value: Value<Color>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class ColorSwatchController implements Controller<ColorSwatchView> {
	public readonly value: Value<Color>;
	public readonly view: ColorSwatchView;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: Config) {
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.view = new ColorSwatchView(doc, {
			value: this.value,
			viewProps: this.viewProps,
		});
	}
}
