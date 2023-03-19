import {BladeApi} from '../../common/api/blade';
import {TpEvent} from '../../common/api/tp-event';
import {ButtonBladeController} from '../controller/button-blade';

export interface ButtonApiEvents {
	click: TpEvent;
}

export class ButtonApi extends BladeApi<ButtonBladeController> {
	get label(): string | null | undefined {
		return this.controller_.labelController.props.get('label');
	}

	set label(label: string | null | undefined) {
		this.controller_.labelController.props.set('label', label);
	}

	get title(): string {
		return this.controller_.buttonController.props.get('title') ?? '';
	}

	set title(title: string) {
		this.controller_.buttonController.props.set('title', title);
	}

	public on<EventName extends keyof ButtonApiEvents>(
		eventName: EventName,
		handler: (ev: ButtonApiEvents[EventName]) => void,
	): ButtonApi {
		const bh = handler.bind(this);
		const emitter = this.controller_.buttonController.emitter;
		emitter.on(eventName, () => {
			bh(new TpEvent(this));
		});
		return this;
	}
}
