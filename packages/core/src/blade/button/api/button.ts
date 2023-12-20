import {BladeApi} from '../../common/api/blade.js';
import {EventListenable} from '../../common/api/event-listenable.js';
import {TpMouseEvent} from '../../common/api/tp-event.js';
import {ButtonBladeController} from '../controller/button-blade.js';

export interface ButtonApiEvents {
	click: TpMouseEvent<ButtonApi>;
}

export class ButtonApi
	extends BladeApi<ButtonBladeController>
	implements EventListenable<ButtonApiEvents>
{
	get label(): string | null | undefined {
		return this.controller.labelController.props.get('label');
	}

	set label(label: string | null | undefined) {
		this.controller.labelController.props.set('label', label);
	}

	get title(): string {
		return this.controller.buttonController.props.get('title') ?? '';
	}

	set title(title: string) {
		this.controller.buttonController.props.set('title', title);
	}

	public on<EventName extends keyof ButtonApiEvents>(
		eventName: EventName,
		handler: (ev: ButtonApiEvents[EventName]) => void,
	): this {
		const bh = handler.bind(this);
		const emitter = this.controller.buttonController.emitter;
		emitter.on(eventName, (ev) => {
			bh(new TpMouseEvent(this, ev.nativeEvent));
		});
		return this;
	}

	public off<EventName extends keyof ButtonApiEvents>(
		eventName: EventName,
		handler: (ev: ButtonApiEvents[EventName]) => void,
	): this {
		const emitter = this.controller.buttonController.emitter;
		emitter.off(eventName, handler);
		return this;
	}
}
