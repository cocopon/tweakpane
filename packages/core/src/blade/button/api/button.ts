import {BladeApi} from '../../common/api/blade';
import {TpEvent} from '../../common/api/tp-event';
import {LabelController} from '../../label/controller/label';
import {ButtonController} from '../controller/button';

interface ButtonApiEvents {
	click: {
		event: TpEvent;
	};
}

export class ButtonApi extends BladeApi<LabelController<ButtonController>> {
	get label(): string | undefined {
		return this.controller_.props.get('label');
	}

	set label(label: string | undefined) {
		this.controller_.props.set('label', label);
	}

	get title(): string {
		return this.controller_.valueController.props.get('title') ?? '';
	}

	set title(title: string) {
		this.controller_.valueController.props.set('title', title);
	}

	public on<EventName extends keyof ButtonApiEvents>(
		eventName: EventName,
		handler: (ev: ButtonApiEvents[EventName]['event']) => void,
	): ButtonApi {
		const bh = handler.bind(this);
		const emitter = this.controller_.valueController.emitter;
		emitter.on(eventName, () => {
			bh(new TpEvent(this));
		});
		return this;
	}
}
