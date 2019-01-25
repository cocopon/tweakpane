import Emitter from '../misc/emitter';

type EventType = 'click';

/**
 * @hidden
 */
export default class Button {
	public readonly emitter: Emitter<EventType>;
	public readonly title: string;

	constructor(title: string) {
		this.emitter = new Emitter();
		this.title = title;
	}

	public click(): void {
		this.emitter.emit('click');
	}
}
