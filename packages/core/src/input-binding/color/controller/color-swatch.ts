import {ValueController} from '../../../common/controller/value';
import {Value} from '../../../common/model/value';
import {ViewProps} from '../../../common/model/view-props';
import {IntColor} from '../model/int-color';
import {ColorSwatchView} from '../view/color-swatch';

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
