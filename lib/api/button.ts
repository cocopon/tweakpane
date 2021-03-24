import {forceCast} from '../misc/type-util';
import {ButtonController} from '../plugin/blade/button/controller/button';
import {LabeledController} from '../plugin/blade/labeled/controller';
import {BladeApi} from './blade-api';

interface ButtonApiEventHandlers {
	click: () => void;
}

export class ButtonApi implements BladeApi {
	/**
	 * @hidden
	 */
	public readonly controller: LabeledController<ButtonController>;

	/**
	 * @hidden
	 */
	constructor(buttonController: LabeledController<ButtonController>) {
		this.controller = buttonController;
	}

	get disabled(): boolean {
		return this.controller.viewProps.get('disabled');
	}

	set disabled(disabled: boolean) {
		this.controller.viewProps.set('disabled', disabled);
	}

	get hidden(): boolean {
		return this.controller.viewProps.get('hidden');
	}

	set hidden(hidden: boolean) {
		this.controller.viewProps.set('hidden', hidden);
	}

	public dispose(): void {
		this.controller.blade.dispose();
	}

	public on<EventName extends keyof ButtonApiEventHandlers>(
		eventName: EventName,
		handler: ButtonApiEventHandlers[EventName],
	): ButtonApi {
		const emitter = this.controller.valueController.button.emitter;
		// TODO: Type-safe
		emitter.on(eventName, forceCast(handler.bind(this)));
		return this;
	}
}
