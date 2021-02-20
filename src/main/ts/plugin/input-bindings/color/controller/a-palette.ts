import {
	getBaseStepForColor,
	getHorizontalStepKeys,
	getStepForKey,
} from '../../../common/controller/ui-util';
import {ValueController} from '../../../common/controller/value';
import {Color} from '../../../common/model/color';
import {Value} from '../../../common/model/value';
import {ViewModel} from '../../../common/model/view-model';
import {
	PointerData,
	PointerHandler,
	PointerHandlerEvents,
} from '../../../common/view/pointer-handler';
import {APaletteView} from '../view/a-palette';

interface Config {
	value: Value<Color>;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class APaletteController implements ValueController<Color> {
	public readonly viewModel: ViewModel;
	public readonly value: Value<Color>;
	public readonly view: APaletteView;
	private ptHandler_: PointerHandler;

	constructor(document: Document, config: Config) {
		this.onKeyDown_ = this.onKeyDown_.bind(this);
		this.onPointerDown_ = this.onPointerDown_.bind(this);
		this.onPointerMove_ = this.onPointerMove_.bind(this);
		this.onPointerUp_ = this.onPointerUp_.bind(this);

		this.value = config.value;

		this.viewModel = config.viewModel;
		this.view = new APaletteView(document, {
			model: this.viewModel,
			value: this.value,
		});

		this.ptHandler_ = new PointerHandler(document, this.view.element);
		this.ptHandler_.emitter.on('down', this.onPointerDown_);
		this.ptHandler_.emitter.on('move', this.onPointerMove_);
		this.ptHandler_.emitter.on('up', this.onPointerUp_);

		this.view.element.addEventListener('keydown', this.onKeyDown_);
	}

	private handlePointerEvent_(d: PointerData): void {
		const alpha = d.px;

		const c = this.value.rawValue;
		const [h, s, v] = c.getComponents('hsv');
		this.value.rawValue = new Color([h, s, v, alpha], 'hsv');
		this.view.update();
	}

	private onPointerDown_(ev: PointerHandlerEvents['down']): void {
		this.handlePointerEvent_(ev.data);
	}

	private onPointerMove_(ev: PointerHandlerEvents['move']): void {
		this.handlePointerEvent_(ev.data);
	}

	private onPointerUp_(ev: PointerHandlerEvents['up']): void {
		this.handlePointerEvent_(ev.data);
	}

	private onKeyDown_(ev: KeyboardEvent): void {
		const step = getStepForKey(
			getBaseStepForColor(true),
			getHorizontalStepKeys(ev),
		);
		const c = this.value.rawValue;
		const [h, s, v, a] = c.getComponents('hsv');
		this.value.rawValue = new Color([h, s, v, a + step], 'hsv');
	}
}
