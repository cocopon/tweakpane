import {ValueController} from '../../../common/controller/value.js';
import {Value} from '../../../common/model/value.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {IntColor} from '../model/int-color.js';
import {ColorSwatchView} from '../view/color-swatch.js';

interface Config {
	value: Value<IntColor>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class ColorSwatchController
	implements ValueController<IntColor, ColorSwatchView>
{
	public readonly value: Value<IntColor>;
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
