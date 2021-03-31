import {forceCast} from '../../../../misc/type-util';
import {BladeApi} from '../../common/api/blade';
import {LabeledController} from '../../labeled/controller';
import {ButtonController} from '../controller/button';

interface ButtonApiEventHandlers {
	click: () => void;
}

export class ButtonApi implements BladeApi {
	/**
	 * @hidden
	 */
	public readonly controller_: LabeledController<ButtonController>;

	/**
	 * @hidden
	 */
	constructor(buttonController: LabeledController<ButtonController>) {
		this.controller_ = buttonController;
	}

	get disabled(): boolean {
		return this.controller_.viewProps.get('disabled');
	}

	set disabled(disabled: boolean) {
		this.controller_.viewProps.set('disabled', disabled);
	}

	get hidden(): boolean {
		return this.controller_.viewProps.get('hidden');
	}

	set hidden(hidden: boolean) {
		this.controller_.viewProps.set('hidden', hidden);
	}

	public dispose(): void {
		this.controller_.blade.dispose();
	}

	public on<EventName extends keyof ButtonApiEventHandlers>(
		eventName: EventName,
		handler: ButtonApiEventHandlers[EventName],
	): ButtonApi {
		const emitter = this.controller_.valueController.button.emitter;
		// TODO: Type-safe
		emitter.on(eventName, forceCast(handler.bind(this)));
		return this;
	}
}
