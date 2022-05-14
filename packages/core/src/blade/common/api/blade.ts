import {View} from '../../../common/view/view';
import {BladeController} from '../controller/blade';

export class BladeApi<C extends BladeController<View>> {
	/**
	 * @hidden
	 */
	public readonly controller_: C;

	/**
	 * @hidden
	 */
	constructor(controller: C) {
		this.controller_ = controller;
	}

	get element(): HTMLElement {
		return this.controller_.view.element;
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
		this.controller_.viewProps.set('disposed', true);
	}
}
