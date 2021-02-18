import {Emitter} from '../misc/emitter';

/**
 * @hidden
 */
export interface ButtonEvents {
	click: {
		sender: Button;
	};
}

/**
 * @hidden
 */
export class Button {
	public readonly emitter: Emitter<ButtonEvents>;
	public readonly title: string;

	constructor(title: string) {
		this.emitter = new Emitter();
		this.title = title;
	}

	public click(): void {
		this.emitter.emit('click', {
			sender: this,
		});
	}
}
