// @flow

import InputValue from '../../model/input-value';
import MonitorValue from '../../model/monitor-value';
import ColorSwatchTextInputView from '../../view/input/color-swatch-text';
import ColorSwatchMonitorController from '../monitor/color-swatch';
import TextInputController from './text';

import type {Formatter} from '../../formatter/formatter';
import type {Color} from '../../model/color';
import type {Parser} from '../../parser/parser';
import type {InputController} from './input';

type Config = {
	formatter: Formatter<Color>,
	parser: Parser<Color>,
	value: InputValue<Color>,
};

export default class ColorSwatchTextInputController implements InputController<Color> {
	swatchMc_: ColorSwatchMonitorController;
	textIc_: TextInputController<Color>;
	value_: InputValue<Color>;
	view_: ColorSwatchTextInputView;

	constructor(document: Document, config: Config) {
		this.value_ = config.value;

		const value = new MonitorValue<Color>(1);
		config.value.emitter.on('change', () => {
			value.append(config.value.rawValue);
		});
		value.append(config.value.rawValue);

		this.swatchMc_ = new ColorSwatchMonitorController(document, {
			value: value,
		});
		this.textIc_ = new TextInputController(document, {
			formatter: config.formatter,
			parser: config.parser,
			value: config.value,
		});

		this.view_ = new ColorSwatchTextInputView(document, {
			swatchMonitorView: this.swatchMc_.view,
			textInputView: this.textIc_.view,
		});
	}

	get value(): InputValue<Color> {
		return this.value_;
	}

	get view(): ColorSwatchTextInputView {
		return this.view_;
	}
}
